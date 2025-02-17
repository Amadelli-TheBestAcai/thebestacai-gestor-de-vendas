import { ProductNfeDTO } from "./productNfe";

export interface NfeDTO {
  cpf?: string;
  email?: string;
  store_id: number;
  total: number;
  discount: number;
  items: ProductNfeDTO[];
  payments: {
    amount: number,
    flag_card: number,
    type: number,
    code_nsu?: string
  }[];
  ref?: string;
  cash_history_id?: number;
}
