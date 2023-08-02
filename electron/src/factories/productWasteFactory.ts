import { ProductWasteDTO } from "../models/gestor/productWaste";
import { useCaseFactory } from "../usecases/useCaseFactory";

import { addProductWaste } from "../usecases/productWaste/addProductWaste";
import { getAllProductsToWaste } from "../usecases/productWaste/getAllProductsToWaste";

export const productWasteFactory = {
  addWaste: async (payload: any) =>
    await useCaseFactory.execute<ProductWasteDTO | undefined>(addProductWaste, {
      payload,
    }),
  getAllProductsToWaste: async () =>
    await useCaseFactory.execute<any>(getAllProductsToWaste),
};
