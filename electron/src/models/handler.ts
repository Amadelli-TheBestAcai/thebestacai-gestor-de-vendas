import { BaseRepository } from "../repository/baseRepository";
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
}

export default new Handler();
