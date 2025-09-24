import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { getLocalCashHandlers } from "./getLocalCashHandlers";
import odinApi from "../../providers/odinApi";
import { checkInternet } from "../../providers/internetConnection";
import { HandlerDto, StoreCashDto } from "../../models/gestor";
import { useCaseFactory } from "../useCaseFactory";
import mercuryApi from "../../providers/mercuryApi";
import { formatHandlesToIntegrate } from "../../helpers/handlersFormaterToIntegrate";

class SynchronizeCashHandler implements IUseCaseFactory {
    constructor(
        private storeCashRepository = new BaseRepository<StoreCashDto>(
            StorageNames.StoreCash
        ),
        private getLocalCashHandlersUseCase = getLocalCashHandlers,
        private handlerRepository = new BaseRepository<HandlerDto>(
            StorageNames.Handler
        ),
        private integratedHandlerRepository = new BaseRepository<HandlerDto>(
            StorageNames.Integrated_Handler
        ),
    ) { }

    async execute(): Promise<void> {
        const isConnected = await checkInternet();
        if (!isConnected) {
            throw new Error("No internet connection");
        }

        const storeCash = await this.storeCashRepository.getOne();

        const { response: cashHandlers, has_internal_error: errorOnCashHandler, error_message: errorMessageOnCashHandler } =
            await useCaseFactory.execute<HandlerDto[] | undefined>(
                this.getLocalCashHandlersUseCase
            );

        if (errorOnCashHandler) {
            throw new Error(errorMessageOnCashHandler || "Não foi possivel obter os dados da movimentação de caixa");
        }

        const { data: { data } } = await odinApi.get(
            `/cash_handler?history_id=${storeCash?.history_id}`
        );

        const cashHandlersToSync = cashHandlers?.filter(ch => !data.some((d) => d.ref === ch.cashHandler.ref));

        if (!cashHandlersToSync?.length) {
            return;
        }

        if (cashHandlersToSync.length > 0) {
            await Promise.all(
                cashHandlersToSync.map(async handlerToIntegrate => {
                    if (handlerToIntegrate.sendToShop) {
                        const {
                            data: { content: { id: orderId } },
                        } = await mercuryApi.post("/purchases", handlerToIntegrate.shopOrder);

                        handlerToIntegrate.cashHandler.order_id = orderId
                    }

                    const formatedHandler = formatHandlesToIntegrate([handlerToIntegrate.cashHandler], storeCash as StoreCashDto);

                    await odinApi.post(
                        `/cash_handler/${storeCash?.store_id}-${storeCash?.code}`,
                        formatedHandler
                    );

                    handlerToIntegrate.cashHandler.to_integrate = false

                    await this.handlerRepository.deleteById(handlerToIntegrate.id)

                    await this.integratedHandlerRepository.upsert(
                        { id: handlerToIntegrate.id }, 
                        handlerToIntegrate            
                    );


                })
            )

        }

    }
}

export const synchronizeCashHandler = new SynchronizeCashHandler();
