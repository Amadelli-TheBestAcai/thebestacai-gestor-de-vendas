import { SaleDto } from "../models/gestor";
import { PaymentType } from "../models/enums/paymentType";
import { SalesTypes } from "../models/enums/salesTypes";

export interface Response {
  store_sale: number,
  delivery_sale: number,
  total: number,
  total_store: number,
  total_delivery: number,
  money: number,
  credit_card: number,
  debit_card: number,
  online: number,
  ticket: number,
  change_amount: number,
  total_ifood: number,
  total_app: number,
  total_others: number,
  pix: number,
}

export const getBalanceHistory = (sales: SaleDto[]): Response => {
  let balanceHistory = {
    change_amount: 0,
    total: 0,
    total_store: 0,
    total_delivery: 0,
    total_ifood: 0,
    total_app: 0,
    total_others: 0,
    store_sale: 0,
    delivery_sale: 0,
    money: 0,
    credit_card: 0,
    debit_card: 0,
    ticket: 0,
    online: 0,
    pix: 0,
  };

  sales.forEach(sale => {
    sale.payments.forEach((payment) => {
      if (payment.type === PaymentType.DINHEIRO) {
        balanceHistory.money = addition(
          balanceHistory.money,
          +payment.amount
        );
      } else if (payment.type === PaymentType.CREDITO) {
        balanceHistory.credit_card = addition(
          balanceHistory.credit_card,
          +payment.amount
        );
      } else if (payment.type === PaymentType.DEBITO) {
        balanceHistory.debit_card = addition(
          balanceHistory.debit_card,
          +payment.amount
        );
      } else if (payment.type === PaymentType.ONLINE) {
        balanceHistory.online = addition(
          balanceHistory.online,
          +payment.amount
        );
      } else if (payment.type === PaymentType.TICKET) {
        balanceHistory.ticket = addition(
          balanceHistory.ticket,
          +payment.amount
        );
      } else if (payment.type === PaymentType.PIX) {
        balanceHistory.pix = addition(
          balanceHistory.pix,
          +payment.amount
        );
      }
    });

    const totalSold = sale.payments.reduce(
      (total, payment) => total + +payment.amount,
      0
    );

    if (sale.type === SalesTypes.LOJA) {
      balanceHistory.store_sale = addition(
        balanceHistory.store_sale,
        1
      );
      balanceHistory.total_store = addition(
        balanceHistory.total_store,
        totalSold
      );
    } else {
      balanceHistory.delivery_sale = addition(
        balanceHistory.delivery_sale,
        1
      );
      balanceHistory.total_delivery = addition(
        balanceHistory.total_delivery,
        totalSold
      );
      if (sale.type === SalesTypes.APP) {
        balanceHistory.total_app = addition(
          balanceHistory.total_app,
          totalSold
        );
      } else if (sale.type === SalesTypes.IFOOD) {
        balanceHistory.total_ifood = addition(
          balanceHistory.total_ifood,
          totalSold
        );
      } else {
        balanceHistory.total_others = addition(
          balanceHistory.total_others,
          totalSold
        );
      }
    }

    balanceHistory.change_amount = addition(
      balanceHistory.change_amount,
      +sale.change_amount
    );

    balanceHistory.total = addition(
      balanceHistory.total,
      totalSold
    );

  })
  return {
    change_amount: +balanceHistory.change_amount.toFixed(2),
    credit_card: +balanceHistory.credit_card.toFixed(2),
    debit_card: +balanceHistory.debit_card.toFixed(2),
    delivery_sale: +balanceHistory.delivery_sale.toFixed(2),
    money: +balanceHistory.money.toFixed(2),
    online: +balanceHistory.online.toFixed(2),
    store_sale: +balanceHistory.store_sale.toFixed(2),
    ticket: +balanceHistory.ticket.toFixed(2),
    total: +balanceHistory.total.toFixed(2),
    total_app: +balanceHistory.total_app.toFixed(2),
    total_delivery: +balanceHistory.total_delivery.toFixed(2),
    total_ifood: +balanceHistory.total_ifood.toFixed(2),
    total_others: +balanceHistory.total_others.toFixed(2),
    total_store: +balanceHistory.total_store.toFixed(2),
    pix: +balanceHistory.pix.toFixed(2),
  };
};

const addition = (first: number, second: number) => {
  return (+first || 0) + (+second || 0);
};