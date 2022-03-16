import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import { v4 } from "uuid";
import moment from "moment";

import apiNfce from "../../providers/apiNfe";
import midasApi from "../../providers/midasApi";

import {
  getCurrentSale,
  addItem,
  onlineIntegration,
  buildNewSale,
} from "./index";
import {
  SaleDto,
  StoreCashDto,
  StoreDto,
  ProductDto,
  EmitNfceDto,
} from "../../models/gestor";
import { NfeDTO } from "../../models/dtos/nfe";

import env from "../../providers/env.json";
const ambiente = env.NFCe_AMBIENTE;

interface Request {
  nfe: NfeDTO;
  saleIdToUpdate?: number;
}

class EmitNfce implements IUseCaseFactory {
  constructor(
    private storeCashRepository = new BaseRepository<StoreCashDto>(
      StorageNames.StoreCash
    ),
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store),
    private saleRepository = new BaseRepository<SaleDto>(StorageNames.Sale),
    private notIntegratedSaleRepository = new BaseRepository<SaleDto>(
      StorageNames.Not_Integrated_Sale
    ),
    private productRepository = new BaseRepository<ProductDto>(
      StorageNames.Product
    ),
    private onlineIntegrationUseCase = onlineIntegration,
    private buildNewSaleUseCase = buildNewSale
  ) {}

  async execute({
    nfe,
    saleIdToUpdate,
  }: Request): Promise<{ error: boolean; message: string }> {
    const hasInternet = await checkInternet();
    if (!hasInternet) {
      return {
        error: true,
        message: "Dispositivo sem conexão",
      };
    }

    const store = await this.storeRepository.getOne();

    const storeCash = await this.storeCashRepository.getOne();

    if (!storeCash || !storeCash.is_opened) {
      return {
        error: true,
        message:
          "Caixa atualmente fechado. Abra o caixa para realizar a emissão",
      };
    }

    const { response: saleResponse, has_internal_error: errorOnBuildNewSale } =
      await useCaseFactory.execute<SaleDto>(this.buildNewSaleUseCase, {
        withPersistence: false,
      });

    if (errorOnBuildNewSale || !saleResponse) {
      throw new Error("Erro ao criar uma nova venda para NFC-e");
    }

    try {
      console.log({
        nfce_payload: {
          ambiente,
          idEmpresa: store?.company_id,
          ...nfe,
        },
      });
      const {
        data: {
          erro: nfe_erro,
          url: nfce_url,
          id: nfce_id,
          message: nfe_message,
          erros: nfe_erros,
        },
      } = await apiNfce.post("/emitirNFCe", {
        ambiente,
        idEmpresa: store?.company_id,
        ...nfe,
      });

      console.log({ nfe_erro });
      if (nfe_erro || nfe_erros?.length) {
        return {
          error: true,
          message: nfe_message || nfe_erros.join(", "),
        };
      }
      if (!nfce_url || !nfce_id) {
        return {
          error: true,
          message:
            "Serviço temporariamente indisponível. Tente novamente mais tarde",
        };
      }
      saleResponse.nfce_url = nfce_url;
      saleResponse.nfce_id = nfce_id;
    } catch (error: any) {
      return {
        error: true,
        message: error?.response?.data?.mensagem?.includes("XML")
          ? "Produtos com dados tributários inválidos ou serviço indisponível. Contate o suporte"
          : error?.response?.data?.mensagem
          ? error.response.data.mensagem
          : "Serviço temporariamente indisponível. Tente novamente mais tarde",
      };
    }

    if (!saleIdToUpdate) {
      try {
        await Promise.all(
          nfe.produtos.map(async (produto) => {
            const product = await this.productRepository.getOne({
              product_id: +produto.codigo,
            });

            if (!product) {
              throw new Error("Produto não encontrado");
            }
            saleResponse?.items.push({
              created_at: moment(new Date()).format("DD/MM/yyyy HH:mm:ss"),
              product: product.product,
              quantity: produto.quantidadeComercial,
              storeProduct: product,
              store_product_id: product.id,
              total:
                +produto.quantidadeComercial *
                +(product?.product?.price_sell || 0),
              update_stock: false,
              id: v4(),
            });
          })
        );
        saleResponse.to_integrate = true;
        saleResponse.is_current = false;
        console.log({ saleResponse });
        await this.notIntegratedSaleRepository.create(saleResponse);
        await useCaseFactory.execute<void>(this.onlineIntegrationUseCase);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await midasApi.put(`/sales/${saleIdToUpdate}`, {
          nfce_id: saleResponse.nfce_id,
          nfce_url: saleResponse.nfce_url,
        });
      } catch {
        return {
          error: true,
          message: `Nfce emita mas houve falha ao vincular na venda, solicite suporte informando a chave gerada: ${saleResponse.nfce_id}`,
        };
      }
    }

    return {
      error: false,
      message: "NFCe emitida com sucesso",
    };
  }
}

export const emitNfce = new EmitNfce();
