import { checkInternet } from "../../providers/internetConnection";
import tefApi from "../../providers/tefApi";
import { verifyConnectionTEF } from "../../providers/verifyConnectionTEF";
import { useCaseFactory } from "../useCaseFactory";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { findPinPad } from "./findPinPad";
import { writeGestorTefLog } from "../../helpers/writeGestorTefLog"; // 👈 novo import

class FinalizeTransaction implements IUseCaseFactory {
    constructor(private findPinPadUseCase = findPinPad) { }

    async execute(codes_nsu: string[]): Promise<void> {
        const start = Date.now();
        let MessageError: string | null = null;
        let endpoint = "/finaliza-transacao";

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

        const { data } = await tefApi.post(endpoint, codes_nsu);

        const tempoTotalMs = Date.now() - start;

        writeGestorTefLog("Finaliza Transação TEF", {
            Payload: { codes_nsu },
            Response: data,
            IsConnectInternet: isConnectInternet,
            tempoTotalMs,
        });

        return data;

    }
}

export const finalizeTransaction = new FinalizeTransaction();
