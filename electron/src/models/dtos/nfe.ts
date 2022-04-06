import { ProductNfeDTO } from "./productNfe";

export interface NfeDTO {
  cpf: string;
  email?: string;
  store_id: number;
  total: number;
  discount: number;
  items: ProductNfeDTO[];
}
