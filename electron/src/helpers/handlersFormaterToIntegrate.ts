import { StoreCashDto } from "../models/gestor";

type Request = {
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

type Response = {
  type: string;
  reason: string;
  amount: number;
  cash_id?: number;
  cash_code?: string;
  store_id?: number;
  cash_history_id?: number;
  order_id?: number;
};

export const formatHandlesToIntegrate = (
  handlers: Request[],
  storeCash: StoreCashDto
): Response[] => {
  const formatedHandlers = handlers.map((handler) => ({
    type: handler.type,
    reason: handler.reason,
    amount: handler.amount,
    order_id: handler.order_id,
    cash_id: handler.cash_id || storeCash.cash_id,
    cash_code: handler.cash_code || storeCash.code,
    store_id: handler.store_id || storeCash.store_id,
    cash_history_id: handler.cash_history_id || storeCash.history_id,
  }));
  return formatedHandlers;
};
