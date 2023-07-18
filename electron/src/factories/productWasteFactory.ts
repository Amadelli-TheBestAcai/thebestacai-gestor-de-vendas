import { ProductWasteDTO } from "../models/dtos/productWaste";
import { addProductWaste } from "../usecases/productWaste/addProductWaste";
import { deleteProductWaste } from "../usecases/productWaste/deleteProductsWaste";
import { getAllWasteProduct } from "../usecases/productWaste/getProductsWaste";
import { useCaseFactory } from "../usecases/useCaseFactory";

export const productWasteFactory = {
  getWasteProducts: async (initialDate: string, finalDate: string) =>
    await useCaseFactory.execute<ProductWasteDTO[]>(getAllWasteProduct, {
      initialDate,
      finalDate,
    }),
  addWaste: async (payload: any) =>
    await useCaseFactory.execute<ProductWasteDTO | undefined>(addProductWaste, {
      payload,
    }),
  deleteProductWaste: async (id: number) =>
    await useCaseFactory.execute<ProductWasteDTO>(deleteProductWaste, { id }),
};
