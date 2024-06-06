import { PaymentType } from "../../models/enums/paymentType";
import tefApi from "../../providers/tefApi";
import { verifyConnectionTEF } from "../../providers/verifyConnectionTEF";
import { IUseCaseFactory } from "../useCaseFactory.interface";

interface Request {
    type: PaymentType;
    amount: number;
}

class TransactionsTef implements IUseCaseFactory {
    async execute({ type, amount }: Request): Promise<any> {
        const isConnect = await verifyConnectionTEF()
        if (!isConnect) {
            throw new Error("O servidor da TEF não está rodando. Verifique se o executável ServerTEF.exe foi instalado")
        }
        
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
                return null
        }

        const { data: { data } } = await tefApi.post(endpoint, { amount });
        return data
    }
}

export const transactionsTef = new TransactionsTef();
