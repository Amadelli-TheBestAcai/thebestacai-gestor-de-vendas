import { IUseCaseFactory } from "../useCaseFactory.interface";
import { ProductDto } from "../../models/gestor";
import { checkInternet } from "../../providers/internetConnection";
import odinApi from "../../providers/odinApi";

interface Request {
  id: number;
  quantity: number;
}

class UpdateProductStock implements IUseCaseFactory {
  constructor() {}

  async execute({ id, quantity }: Request): Promise<ProductDto> {
    const hasInternet = await checkInternet();
    if (!hasInternet) {
    }

    const { data } = await odinApi.patch(`/products_store/${id}/quantity`, {
      quantity,
    });
    return data;
  }
}

export const updateProductStock = new UpdateProductStock();
