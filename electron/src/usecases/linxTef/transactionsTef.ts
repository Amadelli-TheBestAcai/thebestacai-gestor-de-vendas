import { readIdPinPad } from "../../helpers/readIdPinPad";
import { PaymentType } from "../../models/enums/paymentType";
import { checkInternet } from "../../providers/internetConnection";
import tefApi from "../../providers/tefApi";
import { verifyConnectionTEF } from "../../providers/verifyConnectionTEF";
import { useCaseFactory } from "../useCaseFactory";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { findPinPad } from "./findPinPad";
import { writeGestorTefLog } from "../../helpers/writeGestorTefLog"; // 👈 novo import

interface Request {
    type: PaymentType;
    amount: number;
}

class TransactionsTef implements IUseCaseFactory {
    constructor(private findPinPadUseCase = findPinPad) { }

    async execute({ type, amount }: Request): Promise<any> {
        const start = Date.now();
        let idPinPad: string | null = null;
        let endpoint = "";
        let MessageError: string | null = null;

        const isConnectInternet = await checkInternet();
        if (!isConnectInternet) {
            MessageError =
                "Sem conexão com a internet. Verifique sua conexão para usar o serviço TEF e tente novamente.";
            throw new Error(MessageError);
        }

        const isConnect = await verifyConnectionTEF();
        if (!isConnect) {
            MessageError =
                "O servidor TEF não está em execução. Por favor, feche e abra novamente o gestor de vendas ou verifique se o executável ServerTEF.exe está instalado corretamente.";
            throw new Error(MessageError);
        }

        const { response, has_internal_error } =
            await useCaseFactory.execute<string>(this.findPinPadUseCase);

        if (has_internal_error) {
            MessageError = "Erro ao tentar identificar PIN PAD";
            throw new Error(MessageError);
        }

        if (!response) {
            MessageError =
                "Não foi possível encontrar as informações da maquininha (PIN PAD). Verifique se ela está conectada ao computador.";
            throw new Error(MessageError);
        }

        switch (type) {
            case PaymentType.CREDITO:
                endpoint = "/transacao-credito";
                break;
            case PaymentType.DEBITO:
                endpoint = "/transacao-debito";
                break;
            case PaymentType.TICKET:
                endpoint = "/transacao-voucher";
                break;
            case PaymentType.PIX:
                endpoint = "/transacao-qrcode";
                break;
            default:
                throw new Error("Tipo de pagamento inválido");
        }

        const { data: { data } } = await tefApi.post(endpoint, { amount });

        idPinPad = readIdPinPad(response) ?? null;
        data.id_terminal_pagamento = idPinPad;

        const tempoTotalMs = Date.now() - start;

        writeGestorTefLog("Função de transações Tef", {
            Payload: { type, amount, endpoint },
            Response: data,
            Settings: null,
            Sale: null,
            IsConnectInternet: isConnectInternet,
            tempoTotalMs,
        });

        return data;

    }
}

export const transactionsTef = new TransactionsTef();
