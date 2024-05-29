import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { getCurrentSale } from "./getCurrentSale";
import { SaleDto } from "../../models/gestor";
import { removeTransaction } from "../linxTef/removeTransation";

interface Request {
  id: string;
}

class DeletePayment implements IUseCaseFactory {
  constructor(
    private saleRepository = new BaseRepository<SaleDto>(StorageNames.Sale),
    private getCurrentSaleUseCase = getCurrentSale,
    private removeTransationUseCase = removeTransaction
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

    const code_nsu = await this.checkPaymentNsuCode(sale, id)

    if (code_nsu) {
      const { has_internal_error } =
        await useCaseFactory.execute<void>(this.removeTransationUseCase, code_nsu);
      if (has_internal_error) {
        throw new Error("Error ao tentar remover pagamento via tef");
      }
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

  async checkPaymentNsuCode(sale: SaleDto, id: string): Promise<string> {
    let code_nsu: string = ''
    sale.payments.forEach(payment => {
      if (payment.id === id && payment.code_nsu) {
        code_nsu = payment.code_nsu
      }
    });
    return code_nsu;
  }
}

export const deletePayment = new DeletePayment();
