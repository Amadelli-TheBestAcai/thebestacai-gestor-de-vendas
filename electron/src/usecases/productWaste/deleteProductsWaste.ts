import { IUseCaseFactory } from "../useCaseFactory.interface";
import { checkInternet } from "../../providers/internetConnection";
import odinApi from "../../providers/odinApi";

interface Request {
  id: number;
}

class DeleteProductWaste implements IUseCaseFactory {
  async execute({ id }: Request): Promise<void> {
    const is_online = await checkInternet();
    if (!is_online) {
      return;
    }

    await odinApi.delete(`/product_store_waste/${id}`);
  }
}

export const deleteProductWaste = new DeleteProductWaste();
