export interface ItemOutCartDto {
  id: string;
  cash_code?: string;
  store_id?: number;
  reason: string;
  product_id: number;
  to_integrate: boolean;
  created_at?: Date;
  deleted_at?: Date;
  price_sell?:number;
}
