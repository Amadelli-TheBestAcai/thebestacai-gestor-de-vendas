import { checkInternet } from "../../providers/internetConnection";
import tefApi from "../../providers/tefApi";
import { verifyConnectionTEF } from "../../providers/verifyConnectionTEF";
import { IUseCaseFactory } from "../useCaseFactory.interface";

class GetPathCupom implements IUseCaseFactory {
    async execute(): Promise<string> {
        const isConnectInternet = await checkInternet();
        if (!isConnectInternet) {
            throw new Error("Sem conexão com a internet. Verifique sua conexão para usar o serviço TEF e tente novamente.")
        }

        const isConnect = await verifyConnectionTEF()
        if (!isConnect) {
            throw new Error("O servidor da TEF não está rodando. Verifique se o executável ServerTEF.exe foi instalado corretamente")
        }
        const { data: { data: { pathCupom } } } = await tefApi.get(`/obtem-path-cupons`)
        return pathCupom
    }
}
export const getPathCupom = new GetPathCupom();
