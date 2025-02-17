import { useCaseFactory } from "../usecases/useCaseFactory";
import {
  buildNewSale,
  getCurrentSale,
  finishSale,
  integrateAllSalesFromType,
  addPayment,
  getSaleFromApi,
  deleteSaleFromApi,
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
  getVoucher,
  onlineIntegration,
  integrateRewardWithSale,
  getCustomerReward,
  getCurrentCampaign,
  updateStepSale,
  removeStepSale,
  updateStatusPaymentTef,
} from "../usecases/sale";

import { SaleDto, ProductDto, CampaignDto } from "../models/gestor";

import {
  SaleFromApiDTO,
  NfeDTO,
  CustomerVoucherDTO,
} from "../models/dtos";
import { redeemReward } from "../usecases/sale/redeemReward";
import { PaymentTefCancelType } from "../models/enums/PaymentTefCancelType";

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
  addPayment: async (amount: number, type: number, flag_card?: number, turnOffTef?: boolean) =>
    await useCaseFactory.execute<SaleDto>(addPayment, {
      amount,
      type,
      flag_card,
      turnOffTef
    }),
  updateSale: async (id: string | number, payload: SaleDto) =>
    await useCaseFactory.execute<SaleDto>(updateSale, { id, payload }),
  updateStepSale: async (id: string | number, payload: SaleDto) =>
    await useCaseFactory.execute<SaleDto>(updateStepSale, { id, payload }),
  removeStepSale: async (id: string) =>
    await useCaseFactory.execute<void>(removeStepSale, { id }),
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
  getSaleFromApi: async (withClosedCash = false) =>
    await useCaseFactory.execute<SaleFromApiDTO[]>(getSaleFromApi, {
      withClosedCash,
    }),
  getAllIntegratedSales: async () =>
    await useCaseFactory.execute<SaleDto[]>(getAllIntegratedSales),
  getVoucher: async (hash_code: string) =>
    await useCaseFactory.execute<CustomerVoucherDTO>(getVoucher, { hash_code }),
  deleteSaleFromApi: async (params: {
    id: number;
    cash_history: number;
    ref: string;
  }) => await useCaseFactory.execute<void>(deleteSaleFromApi, params),
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
  getCustomerReward: async (hash_code: string) =>
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
        };
      };
    }>(getCustomerReward, {
      hash_code,
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
  getCurrentCampaign: async () =>
    await useCaseFactory.execute<CampaignDto>(getCurrentCampaign),
  updateStatusPaymentTef: async (payment_id: number, code_nsu: string, justify: string, payment_tef_cancel_type: PaymentTefCancelType) =>
    await useCaseFactory.execute<CampaignDto>(updateStatusPaymentTef, { payment_id, code_nsu, justify, payment_tef_cancel_type }),
};
