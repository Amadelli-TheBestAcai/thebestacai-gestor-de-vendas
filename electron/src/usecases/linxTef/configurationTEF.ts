import tefApi from "../../providers/tefApi";
import { verifyConnectionTEF } from "../../providers/verifyConnectionTEF";
import { IUseCaseFactory } from "../useCaseFactory.interface";
class ConfigurationTEF implements IUseCaseFactory {
    async execute(): Promise<void> {
        const isConnect = await verifyConnectionTEF()
        if (!isConnect) {
            throw new Error("O servidor da TEF não está rodando. Verifique se o executável ServerTEF.exe foi instalado")
        }
        await tefApi.get(`/configura-dpos`)
    }
}
export const configurationTEF = new ConfigurationTEF();
