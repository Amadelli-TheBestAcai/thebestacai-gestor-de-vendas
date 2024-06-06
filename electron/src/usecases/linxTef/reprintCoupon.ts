import tefApi from "../../providers/tefApi";
import { verifyConnectionTEF } from "../../providers/verifyConnectionTEF";
import { IUseCaseFactory } from "../useCaseFactory.interface";

class ReprintCoupon implements IUseCaseFactory {
    async execute(): Promise<void> {
        const isConnect = await verifyConnectionTEF()
        if (!isConnect) {
            throw new Error("O servidor da TEF não está rodando. Verifique se o executável ServerTEF.exe foi instalado")
        }
        await tefApi.post(`/transacao-reimpressao-cupom`)
    }
}

export const reprintCoupon = new ReprintCoupon();
