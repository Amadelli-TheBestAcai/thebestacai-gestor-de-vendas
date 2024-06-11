export type PaymentDto = {
  id: string;
  amount: number;
  type: number;
  flag_card?: number;
  code_nsu?: string;
  cnpj_credenciadora?: string;
  numero_autorizacao?: string;
  formated_type?: string;
  tef_status_payment?: number;
  created_at?: string;
  deleted_at?: string;
};
