export type PaymentDto = {
  id: string;
  amount: number;
  type: number;
  flag_card?: number;
  code_nsu?: string;
  cnpj_credenciadora?: string;
  code_autorization?: string;
  formated_type?: string;
  created_at?: string;
  deleted_at?: string;
};
