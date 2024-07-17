import tefApi from "../../providers/tefApi";
import { verifyConnectionTEF } from "../../providers/verifyConnectionTEF";
import { useCaseFactory } from "../useCaseFactory";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { findPinPad } from "./findPinPad";

interface Request {
    code_nsu: string
}

class RemoveTransaction implements IUseCaseFactory {
    constructor(
        private findPinPadUseCase = findPinPad,
    ) { }
    async execute({code_nsu}: Request): Promise<string> {

        const isConnect = await verifyConnectionTEF()
        if (!isConnect) {
            throw new Error("O servidor TEF não está em execução. Por favor, feche e abra novamente o gestor de vendas ou verifique se o executável ServerTEF.exe está instalado corretamente.")
        }
        const { response, has_internal_error } =
            await useCaseFactory.execute<string>(this.findPinPadUseCase);

        if (has_internal_error) {
            throw new Error('Erro ao tentar identificar PIN PAD')
        }

        if (!response) {
            throw new Error("Não foi possível encontrar as informações da maquininha (PIN PAD). Verifique se ela está conectada ao computador.")
        }

        const { data: { data } } = await tefApi.post(`/desfaz-dpos`, { pNumeroControle: code_nsu })
        return data
    }
}

export const removeTransaction = new RemoveTransaction();
