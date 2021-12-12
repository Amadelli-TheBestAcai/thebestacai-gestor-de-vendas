import productModel from "../models/product";

export const productFactory = {
  getProducts: async () => await productModel.getProducts(),
  getSelfService: async () => await productModel.getSelfService(),
};
