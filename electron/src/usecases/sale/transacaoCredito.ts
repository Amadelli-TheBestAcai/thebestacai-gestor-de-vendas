import tefApi from "../../providers/tefApi";
import { IUseCaseFactory } from "../useCaseFactory.interface";

class TransacaoCartaoCredito implements IUseCaseFactory {
    async execute(amount: string): Promise<any> {
        const { data } = await tefApi.post(`/transacao-credito`, { amount })
        return data
    }
}

export const transacaoCartaoCredito = new TransacaoCartaoCredito();
