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
  cash_id?: number,
  cash_history_id?: number
): Response[] => {
  const formatedHandlers = handlers.map((handler) => ({
    type: handler.type,
    reason: handler.reason,
    amount: handler.amount,
    store_id: handler.store_id,
    cash_id: cash_id || handler.cash_id,
    cash_code: handler.cash_code,
    cash_history_id: cash_history_id || handler.cash_history_id,
    order_id: handler.order_id,
  }));
  return formatedHandlers;
};
