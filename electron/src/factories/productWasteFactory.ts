import { ProductWasteDTO } from "../models/gestor/productWaste";
import { addProductWaste } from "../usecases/productWaste/addProductWaste";
import { useCaseFactory } from "../usecases/useCaseFactory";

export const productWasteFactory = {
  addWaste: async (payload: any) =>
    await useCaseFactory.execute<ProductWasteDTO | undefined>(addProductWaste, {
      payload,
    }),
};
