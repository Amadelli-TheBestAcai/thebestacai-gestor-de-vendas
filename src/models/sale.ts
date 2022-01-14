export type Sale = {
  id?: string;
  cash_code?: string;
  store_id?: number;
  cash_id?: number;
  cash_history_id?: number;
  change_amount: number;
  name: string;
  type: string;
  discount: number;
  total: number;
  quantity: number;
  to_integrate: boolean;
  is_current: boolean;
  created_at: Date;
};
