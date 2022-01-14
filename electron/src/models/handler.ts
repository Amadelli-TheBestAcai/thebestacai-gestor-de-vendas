import { BaseRepository } from "../repository/baseRepository";
import { CashHandlerDTO } from "./dtos/cashHandler";
import storeCashModel from "./storeCash";
import { checkInternet } from "../providers/internetConnection";
import odinApi from "../providers/odinApi";
import { v4 } from "uuid";

export type Entity = {
  id: string;
  cashHandler: {
    cash_id: number;
    cash_code: string;
    store_id: number;
    cash_history_id: number;
    type: string;
    reason: string;
    amount: number;
    to_integrate: boolean;
    order_id: number;
  };
  sendToShop: boolean;
  shopOrder: {
    store_id: number;
    due_date: string;
    pay_date: string;
    payment_method: number;
    total: number;
    name: string;
    purchasesItems: {
      product_id: number;
      quantity: number;
      unitary_value: number;
      category_id: number;
      observation: string;
    }[];
  };
};

class Handler extends BaseRepository<Entity> {
  constructor(storageName = "Handler") {
    super(storageName);
  }

  async insert(payload: Omit<Entity, "id">): Promise<Entity> {
    const newHandler: Entity = { id: v4(), ...payload };
    await this.create(newHandler);
    return newHandler;
  }

  async getCashHandlersByStoreCash(): Promise<CashHandlerDTO> {
    const isConnected = await checkInternet();
    if (!isConnected) {
      return {
        handlers: [],
      };
    }

    const currentCash = await storeCashModel.getOne();
    if (!currentCash || !currentCash.is_opened) {
      return {
        handlers: [],
      };
    }

    const { store_id, code } = currentCash;
    if (!store_id || !code) {
      return {
        handlers: [],
      };
    }
    const {
      data: { data },
    } = await odinApi.get(`/cash_handler/${store_id}-${code}`);

    return {
      history_id: currentCash.history_id,
      handlers: data,
    };
  }

  async deleteCashHandlerFromApiService(id: string): Promise<void> {
    const is_online = await checkInternet();
    if (!is_online) {
      return;
    }

    const currentCash = await storeCashModel.getOne();
    if (!currentCash || !currentCash.is_opened) {
      return;
    }

    const { store_id, code } = currentCash;
    if (!store_id || !code) {
      return;
    }

    await odinApi.delete(`/cash_handler/${id}`);
  }
}

export default new Handler();
