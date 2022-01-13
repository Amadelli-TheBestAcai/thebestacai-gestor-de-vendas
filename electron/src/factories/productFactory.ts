import productModel from "../models/product";

export const productFactory = {
  getProducts: async () => await productModel.getProducts(),
  getSelfService: async () => await productModel.getSelfService(),
  getAllPurchaseProducts: async () =>
    await productModel.getAllPurchaseProducts(),
  getAllProductStore: async () => await productModel.getAllProductStore(),
  GetPtoductStoreHistory: async (id: number, page: number, size: number) =>
    await productModel.GetPtoductStoreHistory(id, page, size),
  updateProductStock: async (id: number, quantity: number) =>
    await productModel.updateProductStock(id, quantity),
};
