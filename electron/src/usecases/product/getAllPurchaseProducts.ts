import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import { PurchaseProductDto } from "../../models/gestor";
import odinApi from "../../providers/odinApi";

interface Request {
  local: false;
}

class GetAllPurchaseProducts implements IUseCaseFactory {
  constructor(
    private purchaseProductRepository = new BaseRepository<PurchaseProductDto>(
      StorageNames.Purchase_Product
    )
  ) {}

  async execute({ local }: Request): Promise<PurchaseProductDto[]> {
    const hasInternet = await checkInternet();
    if (local) {
      return await this.purchaseProductRepository.getAll();
    }

    if (!hasInternet) {
      return [];
    }
    const {
      data: { content },
    } = await odinApi.get("/product_categories/products/purchases");
    await this.purchaseProductRepository.createManyAndReplace(content);
    return content;
  }
}

export const getAllPurchaseProducts = new GetAllPurchaseProducts();
