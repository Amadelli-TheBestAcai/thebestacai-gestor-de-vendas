import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import { ProductDto, PurchaseProductDto } from "../../models/gestor";
import odinApi from "../../providers/odinApi";

class GetAllPurchaseProducts implements IUseCaseFactory {
  constructor(
    private productRepository = new BaseRepository<ProductDto>(
      StorageNames.Product
    )
  ) {}

  async execute(): Promise<PurchaseProductDto[]> {
    const hasInternet = await checkInternet();
    if (!hasInternet) {
      return [];
    }
    const {
      data: { content },
    } = await odinApi.get("/product_categories/products/purchases");

    return content;
  }
}

export const getAllPurchaseProducts = new GetAllPurchaseProducts();
