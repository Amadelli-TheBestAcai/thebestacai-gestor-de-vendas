export interface PaymentNfe {
  amount: number;
  type: number;
  flag_card?: number;
  tef_status_payment?: number;
  code_nsu?: string
  numero_autorizacao?: string;
  cnpj_credenciadora?: string;
  cnpj_beneficiario?: string;
  id_terminal_pagamento?: string;
}
