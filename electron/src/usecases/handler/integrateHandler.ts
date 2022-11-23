import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";

import { checkInternet } from "../../providers/internetConnection";
import odinApi from "../../providers/odinApi";
import mercuryApi from "../../providers/mercuryApi";
import { getCurrentStoreCash, openOnlineStoreCash } from "../storeCash";
import { HandlerDto, StoreCashDto } from "../../models/gestor";
import { formatHandlesToIntegrate } from "../../helpers/handlersFormaterToIntegrate";

class IntegrateHandler implements IUseCaseFactory {
  constructor(
    private handlerRepository = new BaseRepository<HandlerDto>(
      StorageNames.Handler
    ),
    private integratedHandlerRepository = new BaseRepository<HandlerDto>(
      StorageNames.Integrated_Handler
    ),
    private getCurrentStoreCashUseCase = getCurrentStoreCash,
    private openOnlineStoreCashUseCase = openOnlineStoreCash
  ) { }

  async execute(): Promise<void> {
    const is_online = await checkInternet();
    if (!is_online) {
      return;
    }

    let storeCash: StoreCashDto | undefined = undefined

    const { response: currentCash, has_internal_error: errorOnStoreCash, error_message: errorMessageOnStoreCash } =
      await useCaseFactory.execute<StoreCashDto | undefined>(
        this.getCurrentStoreCashUseCase
      );

    if (errorOnStoreCash) {
      throw new Error(errorMessageOnStoreCash || "Falha na conexão");
    }

    storeCash = currentCash

    if (!storeCash) {
      throw new Error("Erro não encontrado");
    }

    if (!storeCash.is_opened) {
      return
    }
    
    if (!storeCash.is_online) {
      const { response: openedOnlineStoreCash, has_internal_error: errorOnOpenOnlineStoreCash, error_message } =
        await useCaseFactory.execute<StoreCashDto>(this.openOnlineStoreCashUseCase);

      if (errorOnOpenOnlineStoreCash) {
        throw new Error(error_message || "Falha ao abrir caixa online");
      }
      storeCash = openedOnlineStoreCash
    }

    const handlers = await this.handlerRepository.getAll();
    const handlersToIntegrate = handlers.filter(
      (_handler) => _handler.cashHandler.to_integrate
    );

    await Promise.all(
      handlersToIntegrate.map(async handlerToIntegrate => {
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
        await this.integratedHandlerRepository.create(handlerToIntegrate)

      })
    )
  }
}

export const integrateHandler = new IntegrateHandler();
