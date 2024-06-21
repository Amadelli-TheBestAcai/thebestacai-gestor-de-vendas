import { PaymentTefCancelType } from "../models/enums/PaymentTefCancelType";
import { PaymentType } from "../models/enums/paymentType";
import { PaymentTefAuditDto } from "../models/gestor/paymentTefAudit";
import {
    configurationTEF,
    finalizeTransaction,
    getPathCupom,
    transactionsTef,
    cancelPaymentTef,
    findPinPad,
    insertPaymentTefAudit,
    integrationPaymentTefAudit
} from "../usecases/linxTef";
import { removeTransaction } from "../usecases/linxTef/removeTransation";
import { reprintCoupon } from "../usecases/linxTef/reprintCoupon";
import { useCaseFactory } from "../usecases/useCaseFactory";


export const tefFactory = {
    transactionsTef: async (type: PaymentType, amount: number) =>
        await useCaseFactory.execute<string | null>(transactionsTef, {
            type, amount
        }),
    configurationTEF: async () =>
        await useCaseFactory.execute<void>(configurationTEF),
    removeTransaction: async () =>
        await useCaseFactory.execute<string>(removeTransaction),
    finalizeTransaction: async (codes_nsu: string[]) =>
        await useCaseFactory.execute<void>(finalizeTransaction, { codes_nsu }),
    getPathCupom: async () =>
        await useCaseFactory.execute<string>(getPathCupom),
    reprintCoupon: async () =>
        await useCaseFactory.execute<void>(reprintCoupon),
    cancelPaymentTef: async () =>
        await useCaseFactory.execute<string>(cancelPaymentTef),
    findPinPad: async () =>
        await useCaseFactory.execute<string>(findPinPad),
    insertPaymentTefAudit: async (
        type: PaymentType,
        payment_tef_cancel_type: PaymentTefCancelType,
        price_sell: number,
        sale_id: number,
        justify: string,
        code_nsu: string) =>
        await useCaseFactory.execute<PaymentTefAuditDto>(insertPaymentTefAudit, {
            type, payment_tef_cancel_type, price_sell, sale_id, justify, code_nsu
        }),
    integrationPaymentTefAudit: async () =>
        await useCaseFactory.execute<void>(integrationPaymentTefAudit),
};
