import tefApi from "../../providers/tefApi";
import { IUseCaseFactory } from "../useCaseFactory.interface";

class TransacaoCartaoCredito implements IUseCaseFactory {
    async execute(amount: string): Promise<any> {
        const { data: { code_nsu } } = await tefApi.post(`/transacao-credito`, { amount })
        return code_nsu
    }
}

export const transacaoCartaoCredito = new TransacaoCartaoCredito();
