export interface SaleFromApi {
  id: number;
  gv_id?: number;
  client_id?: number;
  abstract_sale: boolean;
  quantity: number;
  total_sold: number;
  items: {
    name: string;
    product_id: number;
    category_id: number;
    product_store_id: number;
    price_unit: string;
    quantity: number;
    total: number;
    sale_id: string;
    created_at: string;
    store_product_id: number;
    storeProduct: {
      id: number;
      product_id: number;
      store_id: number;
      price_unit: string;
      permission: boolean;
      price_sell?: string;
      unity?: string;
      unity_taxable: string;
      price_taxable: string;
      cfop: number;
      icms_origin: number;
      icms_tax_situation: string;
      tax_regime: number;
      pis_tax_situation?: string;
      pis_aliquot_value?: number;
      pis_aliquot_percentage?: number;
      cofins_tax_situation?: string;
      cofins_aliquot_value?: number;
      cofins_aliquot_percentage?: number;
      additional_information?: string;
      price_permission: boolean;
      icms_aliquot_percentage?: string;
      bc_icms?: string;
      bc_icms_st?: string;
      redution_icms?: string;
      aliquot_final_consumer?: string;
      quantity: number;
      cest?: string;
      created_at: string;
      deleted_at?: string;
    };
    product: {
      id: number;
      name: string;
      category_id: number;
      category: {
        id: number;
        name: string;
        sort?: number;
        created_at: string;
        deleted_at?: null;
      };
      product_store_id: number;
      price_buy: string;
      permission_store: boolean;
      permission_order?: boolean;
      permission_purchase: boolean;
      cod_product: string;
      cod_ncm: string;
      brand?: string;
      unity?: string;
      weight?: string;
      price_sell: string;
      description?: string;
      created_at: string;
      deleted_at?: string;
    };
    update_stock: boolean;
  }[];
  payments: { amount: number; type: number; flag_card?: number, code_nsu?: string }[];
  change_amount: string;
  cash_id: number;
  cash_history_id: number;
  type: number;
  discount: string;
  nfce_id?: number;
  nfce_focus_id?: number;
  nfce_url?: string;
  nfce?: {
    id?: number;
    cnpj_emitente?: string;
    ref?: string;
    status?: string;
    status_sefaz?: string;
    mensagem_sefaz?: string;
    chave_nfe?: string;
    numero?: string;
    serie?: string;
    caminho_xml_nota_fiscal?: string;
    caminho_danfe?: string;
    numero_inicial?: string;
    numero_final?: string;
    modelo?: string;
    cnpj?: string;
    qrcode_url: string;
    caminho_xml?: string;
    codigo?: string;
    mensagem?: string;
    created_at?: Date;
    updated_at?: Date;
  };
  ref?: string;
  created_at: string;
  deleted_at?: string;
}
