import tefApi from "../../providers/tefApi";
import { IUseCaseFactory } from "../useCaseFactory.interface";

class RemoveTransaction implements IUseCaseFactory {
    async execute(code_nsu: string): Promise<void> {
        await tefApi.post(`/desfaz-dpos`, { pNumeroControle: code_nsu })
    }
}

export const removeTransaction = new RemoveTransaction();
