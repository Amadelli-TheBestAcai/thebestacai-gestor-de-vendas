import tefApi from "../../providers/tefApi";
import { IUseCaseFactory } from "../useCaseFactory.interface";

class InicializaDPOS implements IUseCaseFactory {
    async execute(amount: string): Promise<any> {
        const { data } = await tefApi.post(`/inicializa-dpos`, { amount })
        return data
    }
}

export const inicializaDPOS = new InicializaDPOS();
