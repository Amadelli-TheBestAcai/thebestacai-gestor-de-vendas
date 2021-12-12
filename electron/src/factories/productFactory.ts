import productModel from "../models/product";

export const productFactory = {
  getAll: async () => await productModel.getAll(),
};
