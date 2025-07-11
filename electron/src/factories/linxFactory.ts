import { ConfigTefDTO } from "../models/dtos";
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
    integrationPaymentTefAudit,
    getCnpjAccreditor,
    getCpf
} from "../usecases/linxTef";
import { deleteLogs } from "../usecases/linxTef/deleteLogs";
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
    deleteLogs: async () =>
        await useCaseFactory.execute<void>(deleteLogs),
    removeTransaction: async (code_nsu: string) =>
        await useCaseFactory.execute<string>(removeTransaction, { code_nsu }),
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
        sale_id: number,
        justify: string,
        code_nsu: string,
        value: string) =>
        await useCaseFactory.execute<PaymentTefAuditDto>(insertPaymentTefAudit, {
            type, payment_tef_cancel_type, sale_id, justify, code_nsu, value
        }),
    integrationPaymentTefAudit: async () =>
        await useCaseFactory.execute<void>(integrationPaymentTefAudit),
    getCnpjAccreditor: async () =>
        await useCaseFactory.execute<ConfigTefDTO[]>(getCnpjAccreditor),
    getCpf: async () =>
        await useCaseFactory.execute<string>(getCpf),
};
