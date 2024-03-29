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
  companies: Company[];
  products: Product[];
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
};
