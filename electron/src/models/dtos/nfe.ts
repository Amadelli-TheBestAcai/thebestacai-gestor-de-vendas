import { ProductNfeDTO } from "./productNfe";

export type NfeDTO = {
  valorPagamento?: number;
  formaPagamento?: string;
  indicadorFormaPagamento?: number;
  CPFDestinatario?: string;
  informacoesAdicionaisFisco?: string;
  produtos: ProductNfeDTO[];
  ambiente?: number;
};
