export interface PurchaseProductDto {
  id: number;
  name: string;
  sort: number;
  products: {
    id: number;
    name: string;
    category_id: number;
    price_buy: string;
    permission_store: boolean;
    permission_order: boolean;
    cod_product: string;
    cod_ncm: string;
    brand: string;
    unity: number;
    weight: string;
    price_sell: string;
    created_at: string;
    deleted_at: string;
  }[];
}
