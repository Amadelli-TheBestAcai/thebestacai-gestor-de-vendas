export type StoreCashDto = {
  id: string;
  code: string;
  cash_id?: number;
  history_id?: number;
  store_id?: number;
  amount_on_open: number;
  is_opened: boolean;
  is_online: boolean;
  created_at?: string;
};
