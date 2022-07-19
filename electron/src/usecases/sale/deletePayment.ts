import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { getCurrentSale } from "./getCurrentSale";
import { SaleDto } from "../../models/gestor";

interface Request {
  id: string;
}

class DeletePayment implements IUseCaseFactory {
  constructor(
    private saleRepository = new BaseRepository<SaleDto>(StorageNames.Sale),
    private getCurrentSaleUseCase = getCurrentSale
  ) { }

  async execute({ id }: Request): Promise<SaleDto> {
    const { response: sale, has_internal_error: errorOnGetCurrentSale } =
      await useCaseFactory.execute<SaleDto>(this.getCurrentSaleUseCase);

    if (errorOnGetCurrentSale) {
      throw new Error("Erro ao integrar venda");
    }
    if (!sale) {
      throw new Error("Nenhuma venda encontrada");
    }

    sale.payments = sale.payments.filter((_payment) => _payment.id !== id);

    sale.total_paid = +sale.payments
      .reduce((total, payment) => +payment.amount + total, 0)
      .toFixed(2);

    sale.change_amount = +(
      sale.total_paid -
      sale.total_sold
    ).toFixed(2);

    await this.saleRepository.update(sale.id, sale);
    return sale;
  }
}

export const deletePayment = new DeletePayment();
