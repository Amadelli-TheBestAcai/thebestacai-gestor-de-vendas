import tefApi from "../../providers/tefApi";
import { IUseCaseFactory } from "../useCaseFactory.interface";

class TransacaoCartaoDebito implements IUseCaseFactory {
    async execute(amount: string): Promise<any> {
        const { data: {code_nsu} } = await tefApi.post(`/transacao-debito`, {amount})
        return code_nsu
    }
}

export const transacaoCartaoDebito = new TransacaoCartaoDebito();
