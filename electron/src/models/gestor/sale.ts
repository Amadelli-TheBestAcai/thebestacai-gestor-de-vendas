import { CustomerVoucherDTO } from "../dtos/customerVoucher";
export interface SaleDto {
  id: string;
  gv_id?: number;
  name?: string;
  nps_score?: number;
  enabled?: boolean;
  customer_reward_id?: number;
  client_cpf?: string;
  client_phone?: string;
  client_email?: string;
  user_id?: number;
  store_id?: number;
  justify?: string;
  abstract_sale?: boolean;
  quantity: number;
  change_amount: number;
  type: number;
  formated_type?: string;
  discount: number;
  nfce_id?: number;
  nfce_focus_id?: number;
  nfce_url?: string;
  created_at?: string;
  deleted_at?: string;
  cash_id?: number;
  client_id?: number;
  cash_history_id?: number;
  is_online: boolean;
  is_current: boolean;
  is_integrated: boolean;
  to_integrate: boolean;
  total_paid: number;
  total_sold: number;
  customer_nps_reward_id?: number;
  customer_nps_reward_discount?: number;
  cpf_used_club?: boolean;
  cpf_used_nfce?: boolean;

  nfce?: {
    qrcode_url: string;
  };
  items: {
    id: string;
    store_product_id: number;
    total: number;
    customer_reward_id?: number;
    product: {
      id: number;
      name: string;
      price_buy?: string;
      permission_store?: boolean;
      permission_order?: boolean;
      permission_purchase?: boolean;
      cod_product?: string;
      cod_ncm?: string;
      brand?: string;
      unity?: number;
      weight?: string;
      price_sell?: string;
      description?: string;
      created_at?: string;
      deleted_at?: string;
      upload_url?: string;
      category: {
        id: number;
        name: string;
        sort?: number;
        created_at?: string;
        deleted_at?: string;
      };
    };
    quantity: number;
    created_at: string;
    deleted_at?: string;
    update_stock: boolean;
    storeProduct: {
      id: number;
      product_id?: number;
      store_id?: number;
      price_unit?: string;
      permission: boolean;
      price_sell?: string;
      unity?: string;
      unity_taxable?: string;
      price_taxable?: string;
      cfop?: number;
      icms_origin?: number;
      icms_tax_situation?: string;
      tax_regime?: number;
      pis_tax_situation?: string;
      pis_aliquot_value?: string;
      pis_aliquot_percentage?: string;
      cofins_tax_situation?: string;
      cofins_aliquot_value?: string;
      cofins_aliquot_percentage?: string;
      additional_information?: string;
      price_permission: boolean;
      icms_aliquot_percentage?: string;
      bc_icms?: string;
      bc_icms_st?: string;
      redution_icms?: string;
      aliquot_final_consumer?: string;
      quantity?: number;
      cest?: string;
      created_at: string;
      deleted_at?: string;
    };
  }[];
  payments: {
    id: string;
    amount: number;
    formated_type?: string;
    flag_card?: number;
    type: number;
    code_nsu?: string;
    cnpj_credenciadora?: string;
    numero_autorizacao?: string;
    tef_status_payment?: number;
    cnpj_beneficiario?: string;
    id_terminal_pagamento?: string;
    created_at?: string;
    deleted_at?: string;
  }[];
  customerVoucher?: CustomerVoucherDTO;
  cupom?: string;
  ref?: string;
}
