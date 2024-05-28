import { PaymentType } from "../models/enums/paymentType";
import { configurationTEF, transactionsTef } from "../usecases/linxTef";
import { useCaseFactory } from "../usecases/useCaseFactory";


export const tefCartFactory = {
    transactionsTef: async (type: PaymentType, amount: number) =>
        await useCaseFactory.execute<string | null>(transactionsTef, {
            type, amount
        }),
    configurationTEF: async () =>
        await useCaseFactory.execute<void>(configurationTEF),
};
