import { checkInternet } from "../../providers/internetConnection";
import tefApi from "../../providers/tefApi";
import { verifyConnectionTEF } from "../../providers/verifyConnectionTEF";
import { useCaseFactory } from "../useCaseFactory";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { findPinPad } from "./findPinPad";

class FinalizeTransaction implements IUseCaseFactory {
    constructor(
        private findPinPadUseCase = findPinPad,
    ) { }
    async execute(codes_nsu: string[]): Promise<void> {
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
            throw new Error("Não foi encontrado as informações do PIN PAD, verifique se ele está conectado ao computador")
        }

        const { data } = await tefApi.post(`/finaliza-transacao`, codes_nsu)
        return data
    }
}

export const finalizeTransaction = new FinalizeTransaction();
