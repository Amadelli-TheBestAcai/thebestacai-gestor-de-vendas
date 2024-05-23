import tefApi from "../../providers/tefApi";
import { IUseCaseFactory } from "../useCaseFactory.interface";

class FinalizaDPOS implements IUseCaseFactory {
    async execute(): Promise<any> {
        const { data } = await tefApi.post(`/finaliza-dpos`)
        return data
    }
}

export const finalizaDPOS = new FinalizaDPOS();
