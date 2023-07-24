import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { ProductDto, SaleDto } from "../../models/gestor";
import { onlineIntegration } from "./onlineIntegration";
import moment from "moment";
import { v4 } from "uuid";

interface Request {
  sale: SaleDto;
  products_ids: number[];
}

class IntegrateRewardWithSale implements IUseCaseFactory {
  constructor(
    private notIntegratedSaleRepository = new BaseRepository<SaleDto>(
      StorageNames.Not_Integrated_Sale
    ),
    private onlineIntegrationUseCase = onlineIntegration,
    private productRepository = new BaseRepository<ProductDto>(
      StorageNames.Product
    )
  ) {}

  async execute({ sale, products_ids }: Request): Promise<void> {
    await Promise.all(
      products_ids.map(async (product_id) => {
        const product = await this.productRepository.getOne({
          product_id: product_id,
        });
        if (!product) {
          throw new Error("Produto não encontrado");
        }
        sale?.items.push({
          created_at: moment(new Date()).format("DD/MM/yyyy HH:mm:ss"),
          product: product.product,
          quantity: Number(product?.quantity),
          storeProduct: product,
          store_product_id: product.id,
          total: Number(product.price_sell),
          update_stock: false,
          id: v4(),
        });
      })
    );
    await this.notIntegratedSaleRepository.create(sale);

    const {
      has_internal_error: errorOnOnlineTntegrate,
      response,
      error_message,
    } = await useCaseFactory.execute<void>(this.onlineIntegrationUseCase);

    if (errorOnOnlineTntegrate) {
      throw new Error(error_message || "Erro ao integrar venda online");
    } else {
      return response;
    }
  }
}

export const integrateRewardWithSale = new IntegrateRewardWithSale();
