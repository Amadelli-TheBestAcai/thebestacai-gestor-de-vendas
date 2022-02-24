export interface HandlerDto {
  id: string;
  cashHandler: {
    id?: string;
    cash_id?: number;
    cash_code?: string;
    store_id?: number;
    cash_history_id?: number;
    type: string;
    reason: string;
    amount: number;
    to_integrate?: boolean;
    order_id?: number;
  };
  sendToShop: boolean;
  shopOrder: {
    store_id: number;
    due_date: string;
    pay_date: string;
    payment_method: number;
    total: number;
    name: string;
    purchasesItems: {
      product_id: number;
      quantity: number;
      unitary_value: number;
      category_id: number;
      observation: string;
    }[];
  };
}
