import tefApi from "../../providers/tefApi";
import { IUseCaseFactory } from "../useCaseFactory.interface";

class TransacaoVoucher implements IUseCaseFactory {
    async execute(amount: string): Promise<any> {
        const { data } = await tefApi.post(`/transacao-voucher`, { amount })
        return data
    }
}

export const transacaoVoucher = new TransacaoVoucher();
