import { BaseRepository } from "../repository/baseRepository";
import { checkInternet } from "../providers/internetConnection";
import odinApi from "../providers/odinApi";
import midasApi from "../providers/midasApi";
import storeModel from "../models/store";
import { v4 } from "uuid";
import { BalanceDTO } from "./dtos/balance";
import { getBalance } from "../helpers/BalanceFormater";

export type Entity = {
  id: string;
  code: string;
  cash_id?: number;
  history_id?: number;
  store_id?: number;
  amount_on_open: number;
  is_opened: boolean;
  is_online: boolean;
};

export const context = "StoreCash";

class StoreCash extends BaseRepository<Entity> {
  constructor(storageName = context) {
    super(storageName);
  }

  async openStoreCash(
    code: string,
    amount_on_open: number
  ): Promise<Entity | undefined> {
    const payload: Entity = {
      id: v4(),
      code,
      amount_on_open,
      is_opened: true,
      is_online: false,
    };
    const isConnected = await checkInternet();
    if (isConnected) {
      const currentStore = await storeModel.getOne();
      const {
        data: {
          data: { cash_id, history_id, store_id },
        },
      } = await odinApi.put(
        `/store_cashes/${currentStore?.company_id}-${code}/open`,
        {
          amount_on_open: amount_on_open.toString(),
        }
      );
      payload.cash_id = cash_id;
      payload.history_id = history_id;
      payload.store_id = store_id;
      payload.is_online = true;
    }
    await this.clear();
    await this.create(payload);
    return payload;
  }

  async getAvailableStoreCashes(): Promise<
    | {
        store_cash: string;
        available: boolean;
      }[]
    | undefined
  > {
    const isOnline = await checkInternet();
    if (isOnline) {
      const currentStore = await storeModel.getOne();
      const {
        data: { data },
      } = await odinApi.get(
        `/store_cashes/${currentStore?.company_id}/summary`
      );
      const { open, closed } = data;
      let cashes = open.map((cash) => ({
        store_cash: cash.split("-")[1],
        available: false,
      }));

      cashes = [
        ...closed.map((cash) => ({
          store_cash: cash.split("-")[1],
          available: true,
        })),
        ...cashes,
      ];
      cashes = cashes.sort(
        (firstCash, secondCash) =>
          +firstCash.store_cash - +secondCash.store_cash
      );
      return cashes;
    } else {
      return [
        { store_cash: "01", available: false },
        { store_cash: "02", available: false },
        { store_cash: "03", available: false },
        { store_cash: "04", available: false },
        { store_cash: "05", available: false },
        { store_cash: "OFFLINE", available: true },
      ];
    }
  }

  async closeStoreCash(code: string, amount_on_close: number): Promise<void> {
    const isConnected = await checkInternet();
    if (isConnected) {
      const currentStore = await storeModel.getOne();
      await odinApi.put(
        `/store_cashes/${currentStore?.company_id}-${code}/close`,
        { amount_on_close: amount_on_close.toString() }
      );
    }
    const storeCash = await this.getOne();
    await this.update(storeCash?.id, {
      is_opened: false,
    });
  }

  async getStoreCashBalance(
    withClosedCash = false
  ): Promise<BalanceDTO | undefined> {
    const isConnected = await checkInternet();
    if (!isConnected) {
      return undefined;
    }

    const currentCash = await this.getOne();
    if (!currentCash) {
      return undefined;
    }

    if (!withClosedCash && !currentCash?.is_opened) {
      return undefined;
    }

    const { store_id, code } = currentCash;
    if (!store_id || !code) {
      return undefined;
    }

    const { data } = await midasApi.get(`/sales/${store_id}-${code}/history`);
    const balance = getBalance(data);
    return {
      balance,
      isConnected,
    };
  }
}

export default new StoreCash();
