/* TEMP_TEF_VERSION_GUARD_REMOVE_ME */
import { PaymentType } from "../models/enums/paymentType";
import { SettingsDto } from "../models/dtos/settings";

export function paymentTypeFromModalTitle(modalTitle: string): number {
  switch (modalTitle) {
    case "Dinheiro":
      return PaymentType.DINHEIRO;
    case "C. Crédito":
      return PaymentType.CREDITO;
    case "C. Débito":
      return PaymentType.DEBITO;
    case "Ticket":
      return PaymentType.TICKET;
    case "Online":
      return PaymentType.ONLINE;
    case "PIX":
      return PaymentType.PIX;
    default:
      return PaymentType.DINHEIRO;
  }
}


export function wouldUseTefForPaymentAttempt(
  settings: SettingsDto | undefined,
  paymentType: number,
  selectTef: string | undefined,
  paymentModalConnectEffective: boolean
): boolean {
  if (!settings?.should_use_tef) {
    return false;
  }
  if (paymentType === PaymentType.DINHEIRO) {
    return false;
  }
  if (selectTef === "Não") {
    return false;
  }
  if (!paymentModalConnectEffective) {
    return false;
  }
  if (paymentType === PaymentType.PIX && !settings.cnpj_credenciadora) {
    return false;
  }
  return true;
}
