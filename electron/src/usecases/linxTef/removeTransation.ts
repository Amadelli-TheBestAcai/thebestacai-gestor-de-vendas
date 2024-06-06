import tefApi from "../../providers/tefApi";
import { verifyConnectionTEF } from "../../providers/verifyConnectionTEF";
import { IUseCaseFactory } from "../useCaseFactory.interface";

class RemoveTransaction implements IUseCaseFactory {
    async execute(code_nsu: string): Promise<void> {
        const isConnect = await verifyConnectionTEF()
        if (!isConnect) {
            throw new Error("O servidor da TEF não está rodando. Verifique se o executável ServerTEF.exe foi instalado")
        }
        await tefApi.post(`/desfaz-dpos`, { pNumeroControle: code_nsu })
    }
}

export const removeTransaction = new RemoveTransaction();
