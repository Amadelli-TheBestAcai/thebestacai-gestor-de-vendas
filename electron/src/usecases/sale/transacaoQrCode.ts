import tefApi from "../../providers/tefApi";
import { IUseCaseFactory } from "../useCaseFactory.interface";

class TransacaoQrCode implements IUseCaseFactory {
    async execute(amount: string): Promise<any> {
        const { data } = await tefApi.post(`/transacao-qrcode`, { amount })
        return data
    }
}

export const transacaoQrCode = new TransacaoQrCode();
