export interface ItemOutCartDto {
  id: string;
  reason: string;
  product_id: number;
  to_integrate: boolean;
  created_at?: Date;
  deleted_at?: Date;
}
