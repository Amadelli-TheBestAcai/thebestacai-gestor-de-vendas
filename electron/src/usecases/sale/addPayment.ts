import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { getCurrentSale } from "./getCurrentSale";
import { SaleDto, SettingsDto } from "../../models/gestor";
import { PaymentType } from "../../models/enums/paymentType";
import { v4 } from "uuid";
import moment from "moment";
import { transacaoCartaoDebito } from "./transacaoDebito";

interface Request {
  amount: number;
  type: number;
  flag_card?: number;
}

class AddPayment implements IUseCaseFactory {
  constructor(
    private saleRepository = new BaseRepository<SaleDto>(StorageNames.Sale),
    private settingsRepository = new BaseRepository<SettingsDto>(StorageNames.Settings),
    private getCurrentSaleUseCase = getCurrentSale,
    private transacaoCartaoDebitoUseCase = transacaoCartaoDebito
  ) { }

  async execute({ amount, type, flag_card }: Request): Promise<SaleDto> {

    const { response: sale, has_internal_error: errorOnGetCurrentSale } =
      await useCaseFactory.execute<SaleDto>(this.getCurrentSaleUseCase);

    if (errorOnGetCurrentSale) {
      throw new Error("Erro ao integrar venda");
    }

    const settings = await this.settingsRepository.getOne({})

    if (settings?.should_use_tef) {
      const { response, has_internal_error: errorOnTransacaoCartaoDebitoUseCase, error_message } =
        await useCaseFactory.execute<SaleDto>(this.transacaoCartaoDebitoUseCase, amount);

      console.log(response, 'response addPayment');

      if (errorOnTransacaoCartaoDebitoUseCase) {
        throw new Error(error_message || "Erro ao integrar pagamento via TEF");
      }
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
