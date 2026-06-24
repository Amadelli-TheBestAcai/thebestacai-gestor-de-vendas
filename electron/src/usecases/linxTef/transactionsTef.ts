import { readIdPinPad } from "../../helpers/readIdPinPad";
import { PaymentType } from "../../models/enums/paymentType";
import { checkInternet } from "../../providers/internetConnection";
import tefApi from "../../providers/tefApi";
import { verifyConnectionTEF } from "../../providers/verifyConnectionTEF";
import { IUseCaseFactory } from "../useCaseFactory.interface";

interface Request {
    type: PaymentType;
    amount: number;
}

class TransactionsTef implements IUseCaseFactory {
    async execute({ type, amount }: Request): Promise<any> {
        const isConnectInternet = await checkInternet();
        if (!isConnectInternet) {
            throw new Error("Sem conexão com a internet. Verifique sua conexão para usar o serviço TEF e tente novamente.")
        }

        const isConnect = await verifyConnectionTEF()
        if (!isConnect) {
            throw new Error("O servidor TEF não está em execução. Por favor, feche e abra novamente o gestor de vendas ou verifique se o executável ServerTEF.exe está instalado corretamente.")
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
        const infoPinPad = data?.info_pin_pad as string | undefined;
        data.id_terminal_pagamento = infoPinPad
            ? readIdPinPad(infoPinPad)
            : undefined;
        return data
    }
}

export const transactionsTef = new TransactionsTef();
