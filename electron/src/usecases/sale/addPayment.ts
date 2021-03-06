import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { getCurrentSale } from "./getCurrentSale";
import { SaleDto } from "../../models/gestor";
import { PaymentType } from "../../models/enums/paymentType";
import { v4 } from "uuid";
import moment from "moment";

interface Request {
  amount: number;
  type: number;
  flag_card?: number;
}

class AddPayment implements IUseCaseFactory {
  constructor(
    private saleRepository = new BaseRepository<SaleDto>(StorageNames.Sale),
    private getCurrentSaleUseCase = getCurrentSale
  ) { }

  async execute({ amount, type, flag_card }: Request): Promise<SaleDto> {
    const { response: sale, has_internal_error: errorOnGetCurrentSale } =
      await useCaseFactory.execute<SaleDto>(this.getCurrentSaleUseCase);

    if (errorOnGetCurrentSale) {
      throw new Error("Erro ao integrar venda");
    }
    if (!sale) {
      throw new Error("Nenhuma venda encontrada");
    }

    if (type === 1 || type === 2) {
      sale.payments.push({
        id: v4(),
        amount,
        type,
        flag_card,
        formated_type: PaymentType[type],
        created_at: moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
      });
    } else {
      sale.payments.push({
        id: v4(),
        amount,
        type,
        formated_type: PaymentType[type],
        created_at: moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
      });
    }

    const total_paid = +sale.payments
      .reduce((total, payment) => +payment.amount + total, 0)
      .toFixed(2);

    sale.total_paid = total_paid;

    if (total_paid > sale.total_sold) {
      sale.change_amount = +(
        sale.total_paid -
        sale.total_sold
      ).toFixed(2);
    }

    await this.saleRepository.update(sale.id, sale);
    return sale;
  }
}

export const addPayment = new AddPayment();
