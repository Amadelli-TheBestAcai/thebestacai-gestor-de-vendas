import { PaymentType } from "../models/enums/paymentType";
import {
    configurationTEF,
    finalizeTransaction,
    getPathCupom,
    transactionsTef,
    cancelPaymentTef,
    findPinPad
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
        await useCaseFactory.execute<void>(removeTransaction),
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
};
