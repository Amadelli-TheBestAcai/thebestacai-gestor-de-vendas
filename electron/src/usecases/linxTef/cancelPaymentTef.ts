import { SaleDto } from "../../models/gestor";
import { checkInternet } from "../../providers/internetConnection";
import tefApi from "../../providers/tefApi";
import { verifyConnectionTEF } from "../../providers/verifyConnectionTEF";
import { BaseRepository } from "../../repository/baseRepository";
import { StorageNames } from "../../repository/storageNames";
import { useCaseFactory } from "../useCaseFactory";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { findPinPad } from "./findPinPad";

class CancelPaymentTef implements IUseCaseFactory {
    constructor(
        private findPinPadUseCase = findPinPad,
        private salesRepository = new BaseRepository<SaleDto>(StorageNames.Sale),
    ) { }
    async execute(): Promise<string> {
        const isConnectInternet = await checkInternet();
        if (!isConnectInternet) {
            throw new Error("Sem conexão com a internet. Verifique sua conexão para usar o serviço TEF e tente novamente.")
        }

        const saleStandBy = await this.salesRepository.getOne({ is_integrated: false })
        const isPaymentWithTEF = saleStandBy?.payments.map(payment => payment.code_nsu)

        if (isPaymentWithTEF && isPaymentWithTEF?.length > 0) {
            throw new Error('Você possui pagamentos aprovados TEF na tela inicial. Por favor finalize-os primeiro.')
        }

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

        const { data: { data: { code_nsu } } } =
            await tefApi.post(`/transacao-cancelamento-pagamento`)

        return code_nsu
    }
}
export const cancelPaymentTef = new CancelPaymentTef();
