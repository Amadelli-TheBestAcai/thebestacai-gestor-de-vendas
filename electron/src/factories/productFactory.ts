import productModel from "../models/product";
import { useCaseFactory } from "../usecases/useCaseFactory";
import {
  updateProductStock,
  getProductStoreHistory,
} from "../usecases/product";

export const productFactory = {
  getProducts: async () => await productModel.getProducts(),
  getSelfService: async () => await productModel.getSelfService(),
  getAllPurchaseProducts: async () =>
    await productModel.getAllPurchaseProducts(),
  getAllProductStore: async () => await productModel.getAllProductStore(),

  GetProductStoreHistory: async (id: number, page: number, size: number) =>
    await useCaseFactory.execute(getProductStoreHistory, { id, page, size }),
  updateProductStock: async (id: number, quantity: number) =>
    await useCaseFactory.execute(updateProductStock, { id, quantity }),
};
