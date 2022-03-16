import { IUseCaseFactory } from "../useCaseFactory.interface";
import { checkInternet } from "../../providers/internetConnection";
import { PurchaseProductDto } from "../../models/gestor";
import odinApi from "../../providers/odinApi";

class GetAllPurchaseProducts implements IUseCaseFactory {
  constructor() {}

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
