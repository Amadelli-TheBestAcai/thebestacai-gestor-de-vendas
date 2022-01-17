export type Cashier = {
  id: string;
  code: string;
  amount_on_open: number;
  cash_id?: number;
  history_id?: number;
  store_id?: number;
  is_opened?: boolean;
};
