import tefApi from "../../providers/tefApi";
import { verifyConnectionTEF } from "../../providers/verifyConnectionTEF";
import { useCaseFactory } from "../useCaseFactory";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { findPinPad } from "./findPinPad";

class RemoveTransaction implements IUseCaseFactory {
    constructor(
        private findPinPadUseCase = findPinPad,
    ) { }
    async execute(code_nsu: string): Promise<string> {
        const isConnect = await verifyConnectionTEF()
        if (!isConnect) {
            throw new Error("O servidor da TEF não está rodando. Verifique se o executável ServerTEF.exe foi instalado")
        }
        const { response, has_internal_error } =
            await useCaseFactory.execute<string>(this.findPinPadUseCase);

        if (has_internal_error) {
            throw new Error('Erro ao tentar identificar PIN PAD')
        }

        if (!response) {
            throw new Error("Não foi encontrado as informações do PIN PAD, verifique se ele está conectado ao computador")
        }

        const { data: { data } } = await tefApi.post(`/desfaz-dpos`, { pNumeroControle: code_nsu })
        return data
    }
}

export const removeTransaction = new RemoveTransaction();
