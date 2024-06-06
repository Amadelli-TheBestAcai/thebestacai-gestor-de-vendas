import tefApi from "../../providers/tefApi";
import { verifyConnectionTEF } from "../../providers/verifyConnectionTEF";
import { IUseCaseFactory } from "../useCaseFactory.interface";

class FinalizeTransaction implements IUseCaseFactory {
    async execute(codes_nsu: string[]): Promise<void> {
        const isConnect = await verifyConnectionTEF()
        if (!isConnect) {
            throw new Error("O servidor da TEF não está rodando. Verifique se o executável ServerTEF.exe foi instalado")
        }
        const { data } = await tefApi.post(`/finaliza-transacao`, codes_nsu)
        return data
    }
}

export const finalizeTransaction = new FinalizeTransaction();
