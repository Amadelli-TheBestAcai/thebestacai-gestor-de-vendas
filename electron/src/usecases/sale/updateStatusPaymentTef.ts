import { IUseCaseFactory } from "../useCaseFactory.interface";
import midasApi from "../../providers/midasApi";
import { PaymentTefCancelType } from "../../models/enums/PaymentTefCancelType";

interface Request {
    payment_id: number;
    code_nsu: string;
    justify: string;
    payment_tef_cancel_type: PaymentTefCancelType
}

class UpdateStatusPaymentTef implements IUseCaseFactory {
    async execute({ payment_id, code_nsu, justify, payment_tef_cancel_type }: Request): Promise<void> {
        await midasApi.patch(`/sales/update-status-payment-tef/${payment_id}`, { code_nsu, justify, payment_tef_cancel_type });
    }
}

export const updateStatusPaymentTef = new UpdateStatusPaymentTef();
