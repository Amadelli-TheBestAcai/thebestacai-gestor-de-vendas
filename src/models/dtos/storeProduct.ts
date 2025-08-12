import { ProductDto } from "./product";

export interface StoreProductDto {
  id: number;
  product_id?: number;
  product: ProductDto;
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
  upload_url?: string;
}
