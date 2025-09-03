import { VoucherDTO } from './voucher'

export type CustomerVoucherDTO = {
  id: number,
  additional_items_descriptions?: string[],
  voucher_id: number,
  company_id: number,
  customer_id: number,
  hash_code: string,
  voucher_used?: boolean,
  created_at: string,
  updated_at: string,
  deleted_at: null,
  voucher: VoucherDTO
};