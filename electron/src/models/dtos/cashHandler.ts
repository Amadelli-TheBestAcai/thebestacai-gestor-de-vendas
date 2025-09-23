export type CashHandlerDTO = {
  history_id?: number;
  handlers: {
    id: number;
    type: number;
    reason: string;
    amount: string;
    verified: boolean;
    order_id?: number;
    created_at: string;
    deleted_at: string;
    ref: string;
  }[];
};
