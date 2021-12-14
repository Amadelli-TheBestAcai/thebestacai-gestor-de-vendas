import { ItemDto } from "./item";
import { PaymentDto } from "./payment";

export type SaleDto = {
  id: string;
  user_id?: number;
  quantity: number;
  change_amount: number;
  type: number;
  discount: number;
  nfce_id?: number;
  nfce_url?: string;
  created_at?: string;
  deleted_at?: string;
  cash_id?: number;
  client_id?: number;
  cash_history_id?: number;
  is_current: boolean;
  is_integrated: boolean;
  to_integrate: boolean;
  total_paid: number;
  total_sold: number;
  items: ItemDto[];
  payments: PaymentDto[];
};
