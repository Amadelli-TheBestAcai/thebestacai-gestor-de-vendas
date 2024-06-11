import { IUseCaseFactory } from "../useCaseFactory.interface";
import midasApi from "../../providers/midasApi";

interface Request {
    payment_id: number;
}

class UpdateStatusPaymentTef implements IUseCaseFactory {
    async execute({ payment_id }: Request): Promise<void> {
        await midasApi.patch(`/sales/update-status-payment-tef${payment_id}`);
    }
}

export const updateStatusPaymentTef = new UpdateStatusPaymentTef();
