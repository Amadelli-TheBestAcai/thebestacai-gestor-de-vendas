import productModel from "../models/product";

export const productFactory = {
  Product: typeof productModel.loggedUser,
  getAll: async () => await productModel.getAll(),
};
