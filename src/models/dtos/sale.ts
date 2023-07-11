import { ItemDto } from "./item";
import { PaymentDto } from "./payment";

export type SaleDto = {
  id: string;
  user_id?: number;
  sales_campaign_hash: string;
  name?: string;
  quantity: number;
  change_amount: number;
  type: number;
  formated_type?: string;
  discount: number;
  nfce_id?: number;
  nfce_focus_id?: number;
  nfce_url?: string;
  created_at?: string;
  deleted_at?: string;
  cash_id?: number;
  client_id?: number;
  cash_history_id?: number;
  is_online: boolean;
  is_current: boolean;
  is_integrated: boolean;
  nfce?: {
    qrcode_url: string;
  };
  to_integrate: boolean;
  total_paid: number;
  total_sold: number;
  customer_nps_reward_id?: number;
  customer_nps_reward_discount?: number;
  items: ItemDto[];
  payments: PaymentDto[];
  ref?: string;
};
