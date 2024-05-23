import tefApi from "../../providers/tefApi";
import { IUseCaseFactory } from "../useCaseFactory.interface";

class TransacaoCartaoDebito implements IUseCaseFactory {
    async execute(amount: string): Promise<any> {
        const { data } = await tefApi.post(`/transacao-debito`, {amount})
        return data
    }
}

export const transacaoCartaoDebito = new TransacaoCartaoDebito();
