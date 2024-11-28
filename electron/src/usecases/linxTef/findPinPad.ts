import { checkInternet } from "../../providers/internetConnection";
import tefApi from "../../providers/tefApi";
import { verifyConnectionTEF } from "../../providers/verifyConnectionTEF";
import { IUseCaseFactory } from "../useCaseFactory.interface";

class FindPinPad implements IUseCaseFactory {
    async execute(): Promise<string> {
        const isConnectInternet = await checkInternet();
        if (!isConnectInternet) {
            throw new Error("Sem conexão com a internet. Verifique sua conexão para usar o serviço TEF e tente novamente.")
        }

        const isConnect = await verifyConnectionTEF()
        if (!isConnect) {
            throw new Error("O servidor TEF não está em execução. Por favor, feche e abra novamente o gestor de vendas ou verifique se o executável ServerTEF.exe está instalado corretamente.")
        }
        const { data: { data } } = await tefApi.get(`/le-identificacao-pin-pad`)
        return data
    }
}

export const findPinPad = new FindPinPad();
