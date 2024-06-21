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
            throw new Error("Sem conexão com a internet. Verifique sua conexão para usar o serviço TEF e tente novamente.")
        }

        const isConnect = await verifyConnectionTEF()
        if (!isConnect) {
            throw new Error("O servidor da TEF não está rodando. Verifique se o executável ServerTEF.exe foi instalado corretamente")
        }

        const { response, has_internal_error } =
            await useCaseFactory.execute<string>(this.findPinPadUseCase);

        if (has_internal_error) {
            throw new Error('Erro ao tentar identificar PIN PAD')
        }

        if (!response) {
            throw new Error("Não foi possível encontrar as informações da maquininha (PIN PAD). Verifique se ela está conectada ao computador.")
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
