export interface StoreCashDto {
  id: string;
  gv_sales: number;
  code: string;
  cash_id?: number;
  history_id?: number;
  history?: {
    id: number;
    cash_id: number;
    store_id: number;
    backup_url: string;
    opened_at: Date;
    opened_by: number;
    amount_on_open: number;
    closed_at: Date;
    closed_by: number;
    amount_on_close: number;
    amount_on_cash: number;
    in_result: number;
    out_result: number;
    result_cash: number;
    observation: string;
    created_at: Date;
    deleted_at: Date;
  };
  store_id?: number;
  amount_on_open: number;
  is_opened: boolean;
  is_online: boolean;
  created_at?: string;
}
