import { ProductNfe } from "./productNfe";

export interface Nfe {
  cpf?: string;
  email?: string;
  store_id: number;
  total: number;
  discount: number;
  items: ProductNfe[];
}
