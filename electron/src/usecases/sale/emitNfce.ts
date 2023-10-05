import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import { v4 } from "uuid";
import moment from "moment";

import midasApi from "../../providers/midasApi";

import { buildNewSale, onlineIntegration } from "./index";
import { SaleDto, StoreCashDto, ProductDto, StoreDto } from "../../models/gestor";
import { NfeDTO } from "../../models/dtos/nfe";

interface Request {
  nfe: NfeDTO;
  saleIdToUpdate?: number;
  local_update?: boolean;
}

class EmitNfce implements IUseCaseFactory {
  constructor(
        private storeCashRepository = new BaseRepository<StoreCashDto>(
      StorageNames.StoreCash
    ),
    private notIntegratedSaleRepository = new BaseRepository<SaleDto>(
      StorageNames.Not_Integrated_Sale
    ),
    private saleRepository = new BaseRepository<SaleDto>(StorageNames.Sale),
    private productRepository = new BaseRepository<ProductDto>(
      StorageNames.Product
    ),
    private onlineIntegrationUseCase = onlineIntegration,
    private buildNewSaleUseCase = buildNewSale
  ) {}

  async execute({ nfe, saleIdToUpdate, local_update }: Request): Promise<any> {
    const hasInternet = await checkInternet();
    if (!hasInternet) {
      throw new Error("Dispositivo sem conexão");
    }
    
    const storeCash = await this.storeCashRepository.getOne();

    if (!storeCash || !storeCash.is_opened) {
      throw new Error(
        "Caixa atualmente fechado. Abra o caixa para realizar a emissão"
      );
    }

    const { response: saleResponse, has_internal_error: errorOnBuildNewSale } =
      await useCaseFactory.execute<SaleDto>(this.buildNewSaleUseCase, {
        withPersistence: false,
      });

    if (errorOnBuildNewSale || !saleResponse) {
      throw new Error("Erro ao criar uma nova venda para NFC-e");
    }

    const {
      data: { nfce: data },
    } = await midasApi.post("/nfce", {
      ...nfe,
      ref: nfe.ref || saleResponse.ref,
    });

    saleResponse.nfce_focus_id = data.id;
    saleResponse.nfce_url = `https://api.focusnfe.com.br${data.caminho_xml_nota_fiscal}`;

    if (local_update) {
      await this.saleRepository.update(saleIdToUpdate, {
        nfce_focus_id: data.id,
        nfce_url: `https://api.focusnfe.com.br${data.caminho_xml_nota_fiscal}`,
      });
    } else if (!saleIdToUpdate && !local_update) {
      nfe.payments.forEach((payment) =>
        saleResponse.payments.push({
          id: v4(),
          ...payment,
          created_at: moment(new Date()).toString(),
        })
      );
      await Promise.all(
        nfe.items.map(async (produto) => {
          const product = await this.productRepository.getOne({
            id: produto.product_store_id,
          });

          if (!product) {
            throw new Error("Produto não encontrado");
          }
          saleResponse?.items.push({
            created_at: moment(new Date()).format("DD/MM/yyyy HH:mm:ss"),
            product: product.product,
            quantity: produto.quantity,
            storeProduct: product,
            store_product_id: product.id,
            total: produto.price_sell,
            update_stock: false,
            id: v4(),
          });
        })
      );

      saleResponse.to_integrate = true;
      saleResponse.is_current = false;
      saleResponse.abstract_sale = true;
      await this.notIntegratedSaleRepository.create(saleResponse);
      await useCaseFactory.execute<void>(this.onlineIntegrationUseCase);
    } else {
      try {
        await midasApi.put(`/sales/${saleIdToUpdate}`, {
          nfce_focus_id: saleResponse.nfce_focus_id,
        });
      } catch {
        throw new Error(
          `Nfce emita mas houve falha ao vincular na venda, solicite suporte informando a chave gerada: ${saleResponse.nfce_focus_id}`
        );
      }
    }

    return data;
  }
}

export const emitNfce = new EmitNfce();
