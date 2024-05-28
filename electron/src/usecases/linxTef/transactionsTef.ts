import { PaymentType } from "../../models/enums/paymentType";
import tefApi from "../../providers/tefApi";
import { IUseCaseFactory } from "../useCaseFactory.interface";

interface Request {
    type: PaymentType;
    amount: number;
}

class TransactionsTef implements IUseCaseFactory {
    async execute({ type, amount }: Request): Promise<string | null> {
        let endpoint = '';

        switch (type) {
            case PaymentType.CREDITO:
                endpoint = '/transacao-credito';
                break;
            case PaymentType.DEBITO:
                endpoint = '/transacao-debito';
                break;
            case PaymentType.TICKET:
                endpoint = '/transacao-voucher';
                break;
            case PaymentType.PIX:
                endpoint = '/transacao-qrcode';
                break;
            default:
                throw new Error('Tipo de pagamento inválido');
        }

        const { data: { code_nsu } } = await tefApi.post(endpoint, { amount });
        return code_nsu;
    }
}

export const transactionsTef = new TransactionsTef();
