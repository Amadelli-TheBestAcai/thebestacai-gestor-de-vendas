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
  cancelNfce,
  onlineIntegration,
  integrateRewardWithSale,
  getCustomerReward,
} from "../usecases/sale";

import { SaleDto, ProductDto } from "../models/gestor";
import { SaleFromApiDTO, AppSaleDTO, NfeDTO } from "../models/dtos";
import { redeemReward } from "../usecases/sale/redeemReward";

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
  redeemReward: async (id: number, payload: any) =>
    await useCaseFactory.execute<void>(redeemReward, { id, payload }),
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
  deleteSaleFromApi: async (params: {
    id: number;
    cash_history: number;
    gv_id: number;
  }) => {
    try {
      await useCaseFactory.execute<void>(deleteSaleFromApi, params);
      return true;
    } catch {
      return false;
    }
  },
  emitNfce: async (
    nfe: NfeDTO,
    saleIdToUpdate?: number | string,
    local_update?: boolean
  ) =>
    await useCaseFactory.execute<any>(emitNfce, {
      nfe,
      saleIdToUpdate,
      local_update,
    }),
  getCustomerReward: async (phone: string, hash_code: string) =>
    await useCaseFactory.execute<{
      name: string;
      points_customer: number;
      max_points: number;
      total_accumulated_points: number;
      customer_reward: {
        id: number;
        customer_id: number;
        customer_campaign_id: number;
        campaign_reward_id: number;
        created_at: string;
        updated_at: string;
        deleted_at: string;
        hash_code: string;
        taked_at: string;
        campaignReward: {
          id: number;
          campaign_id: number;
          customer_reward_id: number;
          description: string;
          url_image: string;
          s3_key: string;
          points_reward: number;
          created_at: string;
          updated_at: string;
          deleted_at: string;
          product_id: number;
          expirated_at: string;
          observation: string;
        }
      }
    }>(getCustomerReward,
      {
        phone,
        hash_code
      }),
  cancelNfce: async (sale_id: number, justify: string) =>
    await useCaseFactory.execute(cancelNfce, {
      sale_id,
      justify,
    }),
  onlineIntegration: async () =>
    await useCaseFactory.execute<void>(onlineIntegration),
  integrateRewardWithSale: async (product_id: number) =>
    await useCaseFactory.execute<void>(integrateRewardWithSale, {
      product_id,
    }),
};
