import { IUseCaseFactory } from "../useCaseFactory.interface";
import { checkInternet } from "../../providers/internetConnection";
import odinApi from "../../providers/odinApi";

interface Request {
  payload: any;
}

class AddProductWaste implements IUseCaseFactory {
  async execute({ payload }: Request): Promise<void> {
    const hasInternet = await checkInternet();
    if (hasInternet) {
      await odinApi.post(`/product_store_waste`, payload);
    }
  }
}

export const addProductWaste = new AddProductWaste();
