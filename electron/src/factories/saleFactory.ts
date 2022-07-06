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
  deleteSaleDelivery,
} from "../usecases/sale";
import '../usecases/sale/onlineIntegration'
import { SaleDto, ProductDto } from "../models/gestor";
import { SaleFromApiDTO, AppSaleDTO, NfeDTO } from "../models/dtos";

export const saleFactory = {
  getCurrentSale: async () =>
    await useCaseFactory.execute<SaleDto>(getCurrentSale),
  buildNewSale: async (withPersistence = true) =>
    await useCaseFactory.execute<SaleDto>(buildNewSale, { withPersistence }),
  addItem: async (productToAdd: ProductDto, quantity: number, price?: number) =>
    await useCaseFactory.execute<SaleDto>(addItem, {
      productToAdd,
      quantity,
      price,
    }),
  decressItem: async (id: string) =>
    await useCaseFactory.execute<SaleDto>(decressItem, { id }),
  addPayment: async (amount: number, type: number, flag_card?: number) =>
    await useCaseFactory.execute<SaleDto>(addPayment, {
      amount,
      type,
      flag_card,
    }),
  updateSale: async (id: string | number, payload: SaleDto) =>
    await useCaseFactory.execute<SaleDto>(updateSale, { id, payload }),
  getAllStepSales: async () =>
    await useCaseFactory.execute<SaleDto[]>(getAllStepSales),
  createStepSale: async (name: string) =>
    await useCaseFactory.execute<SaleDto>(createStepSale, { name }),
  recouverStepSales: async (id: string) =>
    await useCaseFactory.execute<SaleDto>(recouverStepSales, { id }),
  deletePayment: async (id: string) =>
    await useCaseFactory.execute<SaleDto>(deletePayment, { id }),
  createDelivery: async (payload: any) =>
    await useCaseFactory.execute<void>(createDelivery, { payload }),
  deleteSaleDelivery: async (id: string) =>
    await useCaseFactory.execute<void>(deleteSaleDelivery, { id }),
  getAllDelivery: async () =>
    await useCaseFactory.execute<SaleDto[]>(getAllDelivery),
  finishSale: async (payload: SaleDto, fromDelivery?: boolean) =>
    await useCaseFactory.execute<void>(finishSale, { payload, fromDelivery }),
  integrateAllSalesFromType: async (type: number) =>
    await useCaseFactory.execute<void>(integrateAllSalesFromType, { type }),
  getSaleFromApp: async () =>
    await useCaseFactory.execute<AppSaleDTO[]>(getSaleFromApp),
  getSaleFromApi: async (withClosedCash = false) =>
    await useCaseFactory.execute<SaleFromApiDTO[]>(getSaleFromApi, {
      withClosedCash,
    }),
  getAllIntegratedSales: async () =>
    await useCaseFactory.execute<SaleDto[]>(getAllIntegratedSales),
  deleteSaleFromApi: async (params: { id: number, cash_history: number, gv_id: number }) => {
    try {
      await useCaseFactory.execute<void>(deleteSaleFromApi, params);
      return true;
    } catch {
      return false;
    }
  },
  emitNfce: async (nfe: NfeDTO, saleIdToUpdate?: number) =>
    await useCaseFactory.execute<{ error: boolean; message: string }>(
      emitNfce,
      {
        nfe,
        saleIdToUpdate,
      }
    ),
};
