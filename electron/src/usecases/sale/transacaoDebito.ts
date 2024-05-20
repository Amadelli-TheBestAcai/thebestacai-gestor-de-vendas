import tefApi from "../../providers/tefApi";
import { IUseCaseFactory } from "../useCaseFactory.interface";

class TransacaoCartaoDebito implements IUseCaseFactory {
    async execute(amount: string): Promise<any> {
        console.log(amount);
        const { data } = await tefApi.post(`/transacao-debito`, {amount})
        console.log(data, 'serverrrrr');
        return data
    }
}

export const transacaoCartaoDebito = new TransacaoCartaoDebito();
