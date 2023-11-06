export interface ProductDto {
  id: number;
  name: string;
  category_id: number;
  product_store_id?: number;
  category: {
    id: number;
    name: string;
    sort?: number;
    created_at?: string;
    deleted_at?: string;
  };
  price_buy?: string;
  permission_store?: boolean;
  permission_order?: boolean;
  permission_purchase?: boolean;
  cod_product?: string;
  cod_ncm?: string;
  brand?: string;
  unity?: number;
  weight?: string;
  price_sell?: string;
  description?: string;
  created_at?: string;
  deleted_at?: string;
}
