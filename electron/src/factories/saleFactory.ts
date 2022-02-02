import saleModel, { Entity } from "../models/sale";
import { Entity as ProductDto } from "../models/product";
import { NfeDTO } from "../models/dtos/nfe";

export const saleFactory = {
  getCurrent: async () => await saleModel.getCurrent(),
  getAllIntegratedSales: async () =>
    await saleModel.integrateQueueRepository.getAll(),
  deleteSaleFromApi: async (id: string) => {
    try {
      await saleModel.deleteSaleFromApi(id);
      return true;
    } catch {
      return false;
    }
  },
  getSaleFromApi: async (withClosedCash = false) =>
    await saleModel.getSaleFromApi(withClosedCash),
  finishSale: async (payload: Entity, fromDelivery?: boolean) =>
    await saleModel.finishSale(payload, fromDelivery),
  update: async (id: string | number, payload: Entity) =>
    await saleModel.update(id, payload),
  addPayment: async (amount: number, type: number) =>
    await saleModel.addPayment(amount, type),
  deletePayment: async (id: string) => await saleModel.deletePayment(id),
  decressItem: async (id: string) => await saleModel.decressItem(id),
  addItem: async (productToAdd: ProductDto, quantity: number, price?: number) =>
    await saleModel.addItem(productToAdd, quantity, price),
  getSaleFromApp: async () => await saleModel.getSaleFromApp(),
  createStepSale: async (name: string) => await saleModel.createStepSale(name),
  getAllStepSales: async () => await saleModel.getAllStepSales(),
  recouverStepSales: async (id: string): Promise<Entity> =>
    await saleModel.recouverStepSales(id),
  buildNewSale: async (withPersistence = true): Promise<Entity> =>
    await saleModel.buildNewSale(withPersistence),
  getAllDelivery: async () => await saleModel.deliverySaleRepository.getAll(),
  createDelivery: async (payload: Entity) =>
    await saleModel.deliverySaleRepository.create(payload),
  emitNfce: async (
    nfe: NfeDTO,
    saleIdToUpdate?: number
  ): Promise<{ error: boolean; message: string }> =>
    await saleModel.emitNfce(nfe, saleIdToUpdate),
};
