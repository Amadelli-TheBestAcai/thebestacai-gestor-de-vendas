import { BaseRepository } from "../repository/baseRepository";
import { IBaseRepository } from "../repository/baseRepository.interface";
import { CashHandlerDTO } from "./dtos/cashHandler";
import storeCashModel from "./storeCash";
import { checkInternet } from "../providers/internetConnection";
import { formatHandlesToIntegrate } from "../helpers/handlersFormaterToIntegrate";
import odinApi from "../providers/odinApi";
import { v4 } from "uuid";

export type Entity = {
  id: string;
  cashHandler: {
    id?: string;
    cash_id?: number;
    cash_code?: string;
    store_id?: number;
    cash_history_id?: number;
    type: string;
    reason: string;
    amount: number;
    to_integrate?: boolean;
    order_id?: number;
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
  private integrateQueueRepository: IBaseRepository<Entity>;
  constructor(storageName = "Handler") {
    super(storageName);
    this.integrateQueueRepository = new BaseRepository<Entity>(
      "Integrated_Handler"
    );
  }

  async insert(payload: Omit<Entity, "id">): Promise<Entity> {
    const currentCash = await storeCashModel.getCurrentCash();
    const hasInternet = await checkInternet();

    let order_id = undefined;
    if (hasInternet && payload.sendToShop) {
      const {
        data: { id: orderId },
      } = await odinApi.post("/purchases", payload.shopOrder);
      order_id = orderId;
    }

    const newHandler: Entity = {
      id: v4(),
      ...payload,
    };

    newHandler.cashHandler = {
      ...newHandler.cashHandler,
      id: v4(),
      cash_id: currentCash?.cash_id,
      cash_code: currentCash?.code,
      store_id: currentCash?.store_id,
      cash_history_id: currentCash?.history_id,
      to_integrate: true,
      order_id,
      reason: !payload.cashHandler.reason
        ? "Outros"
        : payload.cashHandler.reason,
    };

    await this.create(newHandler);

    await this.integrateOnline();

    return newHandler;
  }

  async integrateOnline(): Promise<void> {
    const currentCash = await storeCashModel.getCurrentCash();
    const handlers = await this.getAll();

    const handlersToIntegrate = handlers.filter(
      (_handler) => _handler.cashHandler.to_integrate
    );

    const unformatedHandlers = handlersToIntegrate.map(
      (_handler) => _handler.cashHandler
    );

    const formatedHandlers = formatHandlesToIntegrate(unformatedHandlers);

    try {
      await odinApi.post(
        `/cash_handler/${currentCash?.store_id}-${currentCash?.code}`,
        formatedHandlers
      );

      const handlersToNotIntegrate = handlers.filter(
        (_handler) => !_handler.cashHandler.to_integrate
      );

      await this.createManyAndReplace(handlersToNotIntegrate);
      await this.integrateQueueRepository.createMany(handlersToIntegrate);
    } catch (error) {
      console.log(error);
    }
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

  async deleteCashHandlerFromApiService(id: number): Promise<void> {
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
