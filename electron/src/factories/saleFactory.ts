import saleModel, { Entity } from "../models/sale";
import { Entity as ProductDto } from "../models/product";

export const saleFactory = {
  getCurrent: async () => await saleModel.getCurrent(),
  finishSale: async () => await saleModel.finishSale(),
  update: async (id: string | number, payload: Entity) =>
    await saleModel.update(id, payload),
  addPayment: async (amount: number, type: number) =>
    await saleModel.addPayment(amount, type),
  deletePayment: async (id: string) => await saleModel.deletePayment(id),
  decressItem: async (id: string) => await saleModel.decressItem(id),
  addItem: async (productToAdd: ProductDto, quantity: number, price?: number) =>
    await saleModel.addItem(productToAdd, quantity, price),
};
