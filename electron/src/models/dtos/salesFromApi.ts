export interface SaleFromApi {
  id: number
  quantity: number
  change_amount: string
  type: number
  discount: string
  nfce_ref: string
  created_at: string
  deleted_at: string
  nfce_id: number
  nfce_url: string
  item: {
    id: number
    store_product_id: number
    product_id: {
      id: number
      name: string
      category_id: number
      category: {
        id: number
        name: string
        sort: number
        created_at: string
        deleted_at: string
      }
      price_buy: string
      permission_store: boolean
      permission_order: boolean
      permission_purchase: boolean
      cod_product: string
      cod_ncm: string
      brand: string
      unity: string
      weight: string
      price_sell: string
      description: string
      created_at: string
      deleted_at: string
    }
    quantity: string
    created_at: string
    deleted_at: string
  }[]
  total_sold: number
  payments: [
    {
      id: number
      amount: string
      type: number
      created_at: string
      deleted_at: string
    }[]
  ]
}