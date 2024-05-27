import tefApi from "../../providers/tefApi";
import { IUseCaseFactory } from "../useCaseFactory.interface";

class TransacaoVoucher implements IUseCaseFactory {
    async execute(amount: string): Promise<any> {
        const { data: { code_nsu } } = await tefApi.post(`/transacao-voucher`, { amount })
        return code_nsu
    }
}

export const transacaoVoucher = new TransacaoVoucher();
