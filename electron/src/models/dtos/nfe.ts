import { ProductNfeDTO } from "./productNfe";

export interface NfeDTO {
  troco: number;
  indicadorFormaPagamento: number;
  formaPagamento: string;
  valorPagamento: number;
  ambiente?: number;
  CPFDestinatario: string;
  nomeDestinatario?: string;
  municipioDestinatario?: string;
  logradouroDestinatario?: string;
  numeroDestinatario?: string;
  bairroDestinatario?: string;
  UFDestinatario?: string;
  informacoesAdicionaisFisco?: string;
  produtos: ProductNfeDTO[];
}
