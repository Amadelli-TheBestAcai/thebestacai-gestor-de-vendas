import saleModel, { Entity } from "../models/sale";

export const saleFactory = {
  getCurrent: async () => await saleModel.getCurrent(),
  finishSale: async () => await saleModel.finishSale(),
  update: async (id: string | number, payload: Entity) =>
    await saleModel.update(id, payload),
  addPayment: async (amount: number, type: number) =>
    await saleModel.addPayment(amount, type),
  addItem: async (product_id: number, quantity: number) =>
    await saleModel.addItem(product_id, quantity),
};
