export interface IfoodDto {
  id: string;
  status?: string;
  token?: string;
  token_expired_at?: Date;
  refresh_token?: string;
  orders: any[];
}
