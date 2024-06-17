import { PaymentType } from "../../models/enums/paymentType";
import { checkInternet } from "../../providers/internetConnection";
import tefApi from "../../providers/tefApi";
import { verifyConnectionTEF } from "../../providers/verifyConnectionTEF";
import { useCaseFactory } from "../useCaseFactory";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { findPinPad } from "./findPinPad";

interface Request {
    type: PaymentType;
    amount: number;
}

class TransactionsTef implements IUseCaseFactory {
    constructor(
        private findPinPadUseCase = findPinPad,
    ) { }

    async execute({ type, amount }: Request): Promise<any> {
        const isConnectInternet = await checkInternet();
        if (!isConnectInternet) {
            throw new Error('Você está sem conexão com a internet. Verifique sua conexão e tente novamente')
        }

        const isConnect = await verifyConnectionTEF()
        if (!isConnect) {
            throw new Error("O servidor da TEF não está rodando. Verifique se o executável ServerTEF.exe foi instalado")
        }

        const { response, has_internal_error } =
            await useCaseFactory.execute<string>(this.findPinPadUseCase);

        if (has_internal_error) {
            throw new Error('Erro ao tentar identificar PIN PAD')
        }

        if (!response) {
            console.log('object');
            throw new Error("Não foi encontrado as informações do PIN PAD, verifique se ele está conectado ao computador")
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
