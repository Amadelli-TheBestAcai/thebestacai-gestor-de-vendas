export type PaymentDto = {
  id: string;
  amount: number;
  type: number;
  flag_card?: number;
  code_nsu?: string;
  cnpj_credenciadora?: string;
  cnpj_beneficiario?: string;
  numero_autorizacao?: string;
  tef_status_payment?: number;
  id_terminal_pagamento?: string;
  formated_type?: string;
  created_at?: string;
  deleted_at?: string;
};
