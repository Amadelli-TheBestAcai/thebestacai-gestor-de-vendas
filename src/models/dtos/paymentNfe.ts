export interface PaymentNfe {
  amount: number;
  type: number;
  flag_card?: number;
  code_nsu?: string
  numero_autorizacao?: string;
  cnpj_credenciadora?: string;
}
