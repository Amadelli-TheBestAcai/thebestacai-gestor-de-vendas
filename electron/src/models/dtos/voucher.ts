export type VoucherDTO = {
  id: number;
  name: string;
  quantity: number;
  description: string;
  self_service: boolean;
  self_service_discount_amount: string;
  self_service_discount_type: number;
  price_sell: string;
  expiration_date: string;
  url_image: string;
  s3_key: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  available_any_store: boolean;
  points_multiplier: number;
  companies: Company[];
  products: Product[];
  voucher_type?: string | null;
  voucher_config?: DiscountByQuantityConfigDTO | null;
};

export type DiscountByQuantityConfigDTO = {
  trigger_mode: "product" | "category";
  trigger_ids: number[];
  min_combined_quantity: number;
  quantity_with_discount: number;
  apply_discount_on: "cheapest" | "most_expensive";
  discount_value: number;
  discount_mode: "percent" | "fixed";
  min_item_grammage: number | null;
};

type Company = {
  id: number;
  voucher_id: number;
  company_id: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
};

type Product = {
  id?: number;
  voucher_id?: number;
  product_name: string;
  additional_value?: string;
  product_id?: number;
  category_id?: number;
  price_sell: string;
  is_registred?: boolean;
  in_sale?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  discount_type?: number;
};
