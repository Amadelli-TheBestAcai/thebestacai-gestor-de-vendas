export interface IfoodDto {
  id: string;
  is_opened?: boolean;
  merchant_id?: string;
  authorizationCode?: string;
  authorizationCodeVerifier?: string;
  merchant?: any;
  status?: string;
  token?: string;
  token_expired_at?: Date;
  refresh_token?: string;
  orders: any[];
}
