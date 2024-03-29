import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { ProductDto, SaleDto } from "../../models/gestor";
import { onlineIntegration } from "./onlineIntegration";
import moment from "moment";
import { v4 } from "uuid";
import { buildNewSale } from "./buildNewSale";

interface Request {
  product_id: number;
}

class IntegrateRewardWithSale implements IUseCaseFactory {
  constructor(
    private notIntegratedSaleRepository = new BaseRepository<SaleDto>(
      StorageNames.Not_Integrated_Sale
    ),
    private onlineIntegrationUseCase = onlineIntegration,
    private productRepository = new BaseRepository<ProductDto>(
      StorageNames.Product
    ),
    private buildNewSaleUseCase = buildNewSale
  ) {}

  async execute({ product_id }: Request): Promise<void> {
    const { response: newSale, has_internal_error: errorOnBuildNewSale } =
      await useCaseFactory.execute<SaleDto>(this.buildNewSaleUseCase, {withPersistence: false});

    if (errorOnBuildNewSale) {
      throw new Error("Erro ao criar uma nova venda");
    }
    if (!newSale) {
      throw new Error("Nenhuma venda encontrada");
    }

    const product = await this.productRepository.getOne({
      product_id: product_id,
    });

    if (!product) {
      throw new Error("Essa recompensa não foi cadastrada em sua loja!");
    }

    newSale?.items.push({
      created_at: moment(new Date()).format("DD/MM/yyyy HH:mm:ss"),
      product: product.product,
      quantity: 1,
      storeProduct: product,
      store_product_id: product.id,
      total: Number(product.price_sell),
      update_stock: false,
      id: v4(),
    });
    await this.notIntegratedSaleRepository.create(newSale);

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
