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
            throw new Error("Sem conexão com a internet. Verifique sua conexão para usar o serviço TEF e tente novamente.")
        }
        const isConnect = await verifyConnectionTEF()
        if (!isConnect) {
            throw new Error("O servidor TEF não está em execução. Por favor, feche e abra novamente o gestor de vendas ou verifique se o executável ServerTEF.exe está instalado corretamente.")
        }

        const { response, has_internal_error } =
            await useCaseFactory.execute<string>(this.findPinPadUseCase);

        if (has_internal_error) {
            throw new Error('Erro ao tentar identificar PIN PAD')
        }

        if (!response) {
            throw new Error("Não foi possível encontrar as informações da maquininha (PIN PAD). Verifique se ela está conectada ao computador.")
        }

        const { data } = await tefApi.post(`/finaliza-transacao`, codes_nsu)
        return data
    }
}

export const finalizeTransaction = new FinalizeTransaction();
