import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import { v4 } from "uuid";

import apiNfce from "../../providers/apiNfe";
import midasApi from "../../providers/midasApi";

import { getCurrentSale, addItem, onlineIntegration } from "./index";
import {
  SaleDto,
  StoreCashDto,
  StoreDto,
  ProductDto,
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
    private productRepository = new BaseRepository<ProductDto>(
      StorageNames.Product
    ),
    private getCurrentSaleUseCase = getCurrentSale,
    private addItemUseCase = addItem,
    private onlineIntegrationUseCase = onlineIntegration
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

    let sale = {
      cash_code: storeCash.code,
      store_id: store?.company_id,
      cash_id: storeCash.cash_id,
      cash_history_id: storeCash.history_id,
      type: "STORE",
      discount: 0,
      total: 0,
      quantity: nfe.produtos.length,
      to_integrate: false,
      is_current: false,
      nfce_id: null,
      nfce_url: null,
    };

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
      sale = {
        ...sale,
        nfce_id,
        nfce_url,
      };
    } catch (error: any) {
      return {
        error: true,
        message: error?.response?.data?.mensagem.includes("XML")
          ? "Produtos com dados tributários inválidos ou serviço indisponível. Contate o suporte"
          : error?.response?.data?.mensagem
          ? error.response.data.mensagem
          : "Serviço temporariamente indisponível. Tente novamente mais tarde",
      };
    }

    const {
      response: saleResponse,
      has_internal_error: errorOnGetCurrentSale,
    } = await useCaseFactory.execute<SaleDto>(this.getCurrentSaleUseCase);

    if (errorOnGetCurrentSale) {
      throw new Error("Erro ao integrar venda");
    }
    if (!sale) {
      throw new Error("Nenhuma venda encontrada");
    }

    if (!saleIdToUpdate) {
      try {
        await Promise.all(
          nfe.produtos.map(async (produto) => {
            const product = await this.productRepository.getById(
              produto.codigo
            );

            if (!product) {
              throw new Error("Produto não encontrado");
            }

            const payload = {
              name: product?.product.name,
              price_unit: product?.product?.price_sell,
              product_id: product?.product_id,
              product_store_id: product?.store_id,
              category_id: product?.product.category_id,
              quantity: produto.quantidadeComercial,
              sale_id: v4(),
              items: product?.product,
              // total:
              //   +produto.quantidadeComercial * +product?.product?.price_sell,
            };

            const itens = payload.items;
            const quantity = payload.quantity;

            await useCaseFactory.execute<SaleDto>(this.addItemUseCase, {
              itens,
              quantity,
            });
          })
        );

        await this.saleRepository.update(saleResponse?.id, {
          to_integrate: true,
        });

        await useCaseFactory.execute<void>(this.onlineIntegrationUseCase);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await midasApi.put(`/sales/${saleIdToUpdate}`, {
          nfce_id: sale.nfce_id,
          nfce_url: sale.nfce_url,
        });
      } catch {
        return {
          error: true,
          message: `Nfce emita mas houve falha ao vincular na venda, solicite suporte informando a chave gerada: ${sale.nfce_id}`,
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
