export type Balance = {
  store: {
    total: number;
    money: number;
    credit: number;
    debit: number;
    pix: number;
    ticket: number;
  };
  delivery: {
    total: number;
    money: number;
    credit: number;
    debit: number;
    pix: number;
    online: number;
  };
  billing: {
    total: number;
    sales: number;
    delivery_sales: number;
    store_sales: number;
    delivery_ticket: number;
    store_ticket: number;
    discount: number;
  };
};
