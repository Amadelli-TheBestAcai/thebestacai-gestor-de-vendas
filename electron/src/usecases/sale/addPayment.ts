import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { getCurrentSale } from "./getCurrentSale";
import { SaleDto, SettingsDto, StoreDto } from "../../models/gestor";
import { PaymentType } from "../../models/enums/paymentType";
import { v4 } from "uuid";
import moment from "moment";
import { transactionsTef } from "../linxTef";
import { TefPaymentType } from "../../models/enums/tefPaymentType";
import { checkInternet } from "../../providers/internetConnection";
import { writeGestorTefLog } from "../../helpers/writeGestorTefLog";

interface Request {
  amount: number;
  type: number;
  flag_card?: number;
  turnOffTef?: boolean
}

class AddPayment implements IUseCaseFactory {
  constructor(
    private saleRepository = new BaseRepository<SaleDto>(StorageNames.Sale),
    private settingsRepository = new BaseRepository<SettingsDto>(StorageNames.Settings),
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store),
    private getCurrentSaleUseCase = getCurrentSale,
    private transactionsTefUseCase = transactionsTef,

  ) { }

  async execute({ amount, type, flag_card, turnOffTef }: Request): Promise<SaleDto> {
    const start = Date.now();
    const isConnectInternet = await checkInternet();
    let MessageError: string | null = null;


    const { response: sale, has_internal_error: errorOnGetCurrentSale } =
      await useCaseFactory.execute<SaleDto>(this.getCurrentSaleUseCase);

    if (errorOnGetCurrentSale) {
      MessageError = "Erro ao integrar venda"
      throw new Error(MessageError);
    }

    const settings = await this.settingsRepository.getOne({})

    let code_nsu;
    let cnpj_credenciadora;
    let numero_autorizacao;
    let tef_status_payment;
    let cnpj_beneficiario
    let id_terminal_pagamento
    let flag_card_linx_tef

    if (settings?.should_use_tef && type !== PaymentType.DINHEIRO && isConnectInternet && !turnOffTef) {
      const { response, has_internal_error: errorOnGetCurrentSale, error_message } =
        await useCaseFactory.execute<any>(this.transactionsTefUseCase, { type, amount });

      if (errorOnGetCurrentSale) {
        MessageError = error_message || "Erro ao integrar pagamento ao tef"
        throw new Error(MessageError);
      }
      const store = await this.storeRepository.getOne({})

      code_nsu = response?.code_nsu
      cnpj_credenciadora = type === PaymentType.PIX ? settings.cnpj_credenciadora : response?.cnpj_credenciadora
      flag_card = parseInt(response?.flag_card, 10);
      flag_card_linx_tef = response?.flag_card
      numero_autorizacao = response?.code_autorization
      tef_status_payment = TefPaymentType.APROVADO
      cnpj_beneficiario = store?.company?.cnpj
      id_terminal_pagamento = response?.id_terminal_pagamento
    }

    if (!sale) {
      MessageError = "Nenhuma venda encontrada"
      throw new Error(MessageError);
    }

    if (type === PaymentType.CREDITO || type === PaymentType.DEBITO
      || type === PaymentType.TICKET || type === PaymentType.PIX) {
      sale.payments.push({
        id: v4(),
        amount,
        type,
        flag_card,
        code_nsu,
        cnpj_credenciadora,
        numero_autorizacao,
        tef_status_payment,
        cnpj_beneficiario,
        id_terminal_pagamento,
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

    const tempoTotalMs = Date.now() - start;

    writeGestorTefLog("Função addPayment", {
      Payload: { amount, type, flag_card, flag_card_linx_tef },
      Response: { code_nsu, numero_autorizacao, tef_status_payment },
      Sale: sale,
      Settings: settings,
      IsConnectInternet: isConnectInternet,
      TurnOffTef: turnOffTef,
      MessageError: MessageError,
        tempoTotalMs,
    });

    return sale;
  }
}

export const addPayment = new AddPayment();
