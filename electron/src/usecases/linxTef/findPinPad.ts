import { checkInternet } from "../../providers/internetConnection";
import tefApi from "../../providers/tefApi";
import { verifyConnectionTEF } from "../../providers/verifyConnectionTEF";
import { IUseCaseFactory } from "../useCaseFactory.interface";

class FindPinPad implements IUseCaseFactory {
    async execute(): Promise<string> {
        const isConnectInternet = await checkInternet();
        if (!isConnectInternet) {
            throw new Error('Você está sem conexão com a internet. Verifique sua conexão e tente novamente')
        }

        const isConnect = await verifyConnectionTEF()
        if (!isConnect) {
            throw new Error("O servidor da TEF não está rodando. Verifique se o executável ServerTEF.exe foi instalado")
        }
        const { data: { data } } = await tefApi.get(`/le-identificacao-pin-pad`)
        return data
    }
}

export const findPinPad = new FindPinPad();
