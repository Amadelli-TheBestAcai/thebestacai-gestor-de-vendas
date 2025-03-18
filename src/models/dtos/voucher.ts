export type Voucher = {
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
  products: ProductVoucher[];
};

type Company = {
  id: number;
  voucher_id: number;
  company_id: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
};

export type ProductVoucher = {
  id?: number;
  voucher_id?: number;
  product_name: string;
  additional_value?: string;
  is_registred?: boolean;
  in_sale?: boolean;
  product_id?: number;
  category_id?: number;
  price_sell: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};
