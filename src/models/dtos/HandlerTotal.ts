export interface HandlerTotal {
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
}
