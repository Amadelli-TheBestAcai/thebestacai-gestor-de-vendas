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
import { transacaoCartaoCredito } from "./transacaoCredito";
import { transacaoVoucher } from "./transacaoVoucher";
import { transacaoQrCode } from "./transacaoQrCode";

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
    private transacaoCartaoDebitoUseCase = transacaoCartaoDebito,
    private transacaoCartaoCreditoUseCase = transacaoCartaoCredito,
    private transacaoVoucherUseCase = transacaoVoucher,
    private transacaoQrCodeUseCase = transacaoQrCode
  ) { }

  async execute({ amount, type, flag_card }: Request): Promise<SaleDto> {

    const { response: sale, has_internal_error: errorOnGetCurrentSale } =
      await useCaseFactory.execute<SaleDto>(this.getCurrentSaleUseCase);

    if (errorOnGetCurrentSale) {
      throw new Error("Erro ao integrar venda");
    }

    const settings = await this.settingsRepository.getOne({})

    let code_nsu
    if (settings?.should_use_tef) {

      switch (type) {
        case PaymentType.CREDITO:
          const { response: responseCredito, has_internal_error: errorOnTransacaoCartaoCreditoUseCase, error_message } =
            await useCaseFactory.execute<SaleDto>(this.transacaoCartaoCreditoUseCase, amount);

          if (errorOnTransacaoCartaoCreditoUseCase) {
            throw new Error(error_message || "Erro ao tentar realizar  pagamento de credito via TEF");
          }

          code_nsu = responseCredito
          break;

        case PaymentType.DEBITO:
          const { response: responseDebito, has_internal_error: errorOnTransacaoCartaoDebitoUseCase, error_message: error_message_cartao_debito } =
            await useCaseFactory.execute<SaleDto>(this.transacaoCartaoDebitoUseCase, amount);

          if (errorOnTransacaoCartaoDebitoUseCase) {
            throw new Error(error_message || "Erro ao tentar realizar  pagamento de debito via TEF");
          }
          code_nsu = responseDebito
          break;

        case PaymentType.TICKET:
          const { response: responseVoucher, has_internal_error: errorOnTransacaoVoucherUseCase, error_message: error_message_voucher } =
            await useCaseFactory.execute<any>(this.transacaoVoucherUseCase, amount);

          if (errorOnTransacaoVoucherUseCase) {
            throw new Error(error_message_voucher || "Erro ao tentar realizar pagamento de voucher via TEF");
          }
          code_nsu = responseVoucher
          break;

        case PaymentType.PIX:
          const { response: responseQrCode, has_internal_error: errorOnTransacaoQrCodeUseCase, error_message: error_message_qrcode } =
            await useCaseFactory.execute<any>(this.transacaoQrCodeUseCase, amount);

          if (errorOnTransacaoQrCodeUseCase) {
            throw new Error(error_message_qrcode || "Erro ao tentar realizar pagamento via QrCode");
          }
          code_nsu = responseQrCode
          break;

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
        code_nsu,
        formated_type: PaymentType[type],
        created_at: moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
      });
    } else {
      sale.payments.push({
        id: v4(),
        amount,
        type,
        code_nsu,
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
