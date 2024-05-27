import tefApi from "../../providers/tefApi";
import { IUseCaseFactory } from "../useCaseFactory.interface";

class TransacaoQrCode implements IUseCaseFactory {
    async execute(amount: string): Promise<any> {
        const { data: {code_nsu} } = await tefApi.post(`/transacao-qrcode`, { amount })
        return code_nsu
    }
}

export const transacaoQrCode = new TransacaoQrCode();
