import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";

import odinApi from "../../providers/odinApi";
import { getCurrentStoreCash } from "../storeCash/getCurrentStoreCash";
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
    private getCurrentStoreCashUseCase = getCurrentStoreCash
  ) { }

  async execute(): Promise<void> {
    const { response: currentCash, has_internal_error: errorOnStoreCash } =
      await useCaseFactory.execute<StoreCashDto | undefined>(
        this.getCurrentStoreCashUseCase
      );

    if (errorOnStoreCash) {
      throw new Error("Falha na conexão");
    }
    if (!currentCash) {
      throw new Error("Erro ao obter caixa atual");
    }

    if (!currentCash.is_online) {
      return
    }

    const handlers = await this.handlerRepository.getAll();
    const handlersToIntegrate = handlers.filter(
      (_handler) => _handler.cashHandler.to_integrate
    );
    const unformatedHandlers = handlersToIntegrate.map(
      (_handler) => _handler.cashHandler
    );
    const formatedHandlers = formatHandlesToIntegrate(unformatedHandlers, currentCash.cash_id, currentCash.history_id);

    try {
      await odinApi.post(
        `/cash_handler/${currentCash?.store_id}-${currentCash?.code}`,
        formatedHandlers
      );

      const handlersToNotIntegrate = handlers.filter(
        (_handler) => !_handler.cashHandler.to_integrate
      );

      await this.handlerRepository.createManyAndReplace(handlersToNotIntegrate);
      await this.integratedHandlerRepository.createMany(handlersToIntegrate);
    } catch (error) {
      console.log(error);
    }
  }
}

export const integrateHandler = new IntegrateHandler();
