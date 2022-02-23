import { NfeDTO } from "../models/dtos/nfe";
import { useCaseFactory } from "../usecases/useCaseFactory";
import {
  buildNewSale,
  getCurrentSale,
  finishSale,
  integrateAllSalesFromType,
  addPayment,
  getSaleFromApi,
  deleteSaleFromApi,
  getSaleFromApp,
  getAllIntegratedSales,
  updateSale,
  getAllStepSales,
  getAllDelivery,
  createDelivery,
  deletePayment,
  createStepSale,
  addItem,
  recouverStepSales,
  decressItem,
  emitNfce,
} from "../usecases/sale";
import { SaleDto, ProductDto } from "../models/gestor";
import { SaleFromApiDTO, AppSaleDTO } from "../models/dtos";

export const saleFactory = {
  getCurrentSale: async () =>
    await useCaseFactory.execute<SaleDto>(getCurrentSale),
  finishSale: async (payload: SaleDto, fromDelivery?: boolean) =>
    await useCaseFactory.execute<void>(finishSale, { payload, fromDelivery }),
  integrateAllSalesFromType: async (type: number) =>
    await useCaseFactory.execute<void>(integrateAllSalesFromType, { type }),
  getSaleFromApi: async (withClosedCash = false) =>
    await useCaseFactory.execute<SaleFromApiDTO[]>(getSaleFromApi, {
      withClosedCash,
    }),
  deleteSaleFromApi: async (id: string) => {
    try {
      await useCaseFactory.execute<void>(deleteSaleFromApi, { id });
      return true;
    } catch {
      return false;
    }
  },
  getSaleFromApp: async () =>
    await useCaseFactory.execute<AppSaleDTO[]>(getSaleFromApp),
  getAllIntegratedSales: async () =>
    await useCaseFactory.execute<SaleDto[]>(getAllIntegratedSales),
  updateSale: async (id: string | number, payload: SaleDto) =>
    await useCaseFactory.execute<SaleDto>(updateSale, { id, payload }),
  getAllStepSales: async () =>
    await useCaseFactory.execute<SaleDto[]>(getAllStepSales),
  buildNewSale: async (withPersistence = true) =>
    await useCaseFactory.execute<SaleDto>(buildNewSale, { withPersistence }),
  getAllDelivery: async () =>
    await useCaseFactory.execute<SaleDto[]>(getAllDelivery),
  createDelivery: async (payload: any) =>
    await useCaseFactory.execute<void>(createDelivery, { payload }),
  addPayment: async (amount: number, type: number) =>
    await useCaseFactory.execute<SaleDto>(addPayment, { amount, type }),
  deletePayment: async (id: string) =>
    await useCaseFactory.execute<SaleDto>(deletePayment, { id }),
  createStepSale: async (name: string) =>
    await useCaseFactory.execute<SaleDto>(createStepSale, { name }),
  addItem: async (productToAdd: ProductDto, quantity: number, price?: number) =>
    await useCaseFactory.execute<SaleDto>(addItem, {
      productToAdd,
      quantity,
      price,
    }),
  recouverStepSales: async (id: string) =>
    await useCaseFactory.execute<SaleDto>(recouverStepSales, { id }),
  decressItem: async (id: string) =>
    await useCaseFactory.execute(decressItem, { id }),
  emitNfce: async (nfe: NfeDTO, saleIdToUpdate?: number) =>
    await useCaseFactory.execute<{ error: boolean; message: string }>(
      emitNfce,
      { nfe, saleIdToUpdate }
    ),
};
