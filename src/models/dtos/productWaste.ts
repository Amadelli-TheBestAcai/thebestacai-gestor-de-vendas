export interface ProductWasteDTO {
  id: number;
  name: string;
  category_id: number;
  reason?: string;
  category: {
    id: number;
    name: string;
    sort?: number;
    created_at?: string;
    deleted_at?: string;
  };
  price_buy?: string;
  permission_store?: boolean;
  permission_order?: boolean;
  permission_purchase?: boolean;
  cod_product?: number;
  cod_ncm?: string;
  brand?: string;
  weight?: string;
  description?: string;
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
  products_store_waste: ProductStoreWasteDto[];
}

export interface ProductStoreWasteDto {
  id: number;
  product_id: number;
  cash_history_id: number;
  unity: number;
  store_id: number;
  quantity: string;
  url_file: string;
  s3_key: string;
  created_at: string;
  deleted_at: string;
  reason: string;
}
