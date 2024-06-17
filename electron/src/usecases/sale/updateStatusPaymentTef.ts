import { IUseCaseFactory } from "../useCaseFactory.interface";
import midasApi from "../../providers/midasApi";

interface Request {
    payment_id: number;
    code_nsu: string
}

class UpdateStatusPaymentTef implements IUseCaseFactory {
    async execute({ payment_id, code_nsu }: Request): Promise<void> {
        await midasApi.patch(`/sales/update-status-payment-tef/${payment_id}`, { code_nsu });
    }
}

export const updateStatusPaymentTef = new UpdateStatusPaymentTef();
