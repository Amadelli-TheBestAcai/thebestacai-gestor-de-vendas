import tefApi from "../../providers/tefApi";
import { IUseCaseFactory } from "../useCaseFactory.interface";

class FinalizaTransacao implements IUseCaseFactory {
    async execute(): Promise<any> {
        const { data } = await tefApi.post(`/finaliza-transacao`)
        return data
    }
}

export const finalizaTransacao = new FinalizaTransacao();
