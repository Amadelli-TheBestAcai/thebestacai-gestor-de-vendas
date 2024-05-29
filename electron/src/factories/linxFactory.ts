import { PaymentType } from "../models/enums/paymentType";
import { configurationTEF, finalizeTransaction, transactionsTef } from "../usecases/linxTef";
import { removeTransaction } from "../usecases/linxTef/removeTransation";
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
    finalizeTransaction: async () =>
        await useCaseFactory.execute<void>(finalizeTransaction),
};
