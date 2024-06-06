import tefApi from "../../providers/tefApi";
import { verifyConnectionTEF } from "../../providers/verifyConnectionTEF";
import { IUseCaseFactory } from "../useCaseFactory.interface";

class CancelPaymentTef implements IUseCaseFactory {
    async execute(): Promise<string> {
        const isConnect = await verifyConnectionTEF()
        if (!isConnect) {
            throw new Error("O servidor da TEF não está rodando. Verifique se o executável ServerTEF.exe foi instalado")
        }
        const { data: { data: { code_nsu } } } =
            await tefApi.post(`/transacao-cancelamento-pagamento`)

        return code_nsu
    }
}
export const cancelPaymentTef = new CancelPaymentTef();
