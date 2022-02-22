import productModel from "../models/product";
import { useCaseFactory } from "../usecases/useCaseFactory";
import {
  updateProductStock,
  getProductStoreHistory,
  getAllProductStore,
  getAllPurchaseProducts,
  getSelfService,
} from "../usecases/product";

export const productFactory = {
  getProducts: async () => await productModel.getProducts(),

  getSelfService: async () => await useCaseFactory.execute(getSelfService),
  getAllPurchaseProducts: async () =>
    await useCaseFactory.execute(getAllPurchaseProducts),
  getAllProductStore: async () =>
    await useCaseFactory.execute(getAllProductStore),
  GetProductStoreHistory: async (id: number, page: number, size: number) =>
    await useCaseFactory.execute(getProductStoreHistory, { id, page, size }),
  updateProductStock: async (id: number, quantity: number) =>
    await useCaseFactory.execute(updateProductStock, { id, quantity }),
};
