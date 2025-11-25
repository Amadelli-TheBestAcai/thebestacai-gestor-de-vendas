import { v4 } from "uuid";

import { useCaseFactory } from "../useCaseFactory";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { BaseRepository } from "../../repository/baseRepository";
import { StorageNames } from "../../repository/storageNames";

import { getCurrentStoreCash } from "../storeCash/getCurrentStoreCash";
import { integrateHandler } from "./integrateHandler";
import { HandlerDto, StoreCashDto, StoreDto } from "../../models/gestor";

interface Request {
  payload: any;
}

class InsertHandler implements IUseCaseFactory {
  constructor(
    private handlerRepository = new BaseRepository<HandlerDto>(
      StorageNames.Handler
    ),
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store),
    private getCurrentStoreCashUseCase = getCurrentStoreCash,
    private integrateHandlerUseCase = integrateHandler
  ) {}

  async execute({ payload }: Request): Promise<HandlerDto> {
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

    if (!currentCash) {
      throw new Error("Erro ao obter caixa atual");
    }

    const store = await this.storeRepository.getOne();

    if (!store) {
      throw new Error("Nenhuma loja encontrada");
    }

    const newHandler: HandlerDto = {
      id: v4(),
      ...payload,
    };

    newHandler.cashHandler = {
      ...newHandler.cashHandler,
      id: v4(),
      cash_id: undefined,
      cash_code: undefined,
      store_id: store.company_id,
      cash_history_id: undefined,
      to_integrate: true,
      reason: !payload.cashHandler.reason
        ? "Outros"
        : payload.cashHandler.reason,
        ref: v4(),
    };

    if (currentCash.is_opened && currentCash.is_online) {
      newHandler.cashHandler.cash_id = currentCash.cash_id;
      newHandler.cashHandler.cash_code = currentCash.code;
      newHandler.cashHandler.cash_history_id = currentCash.history_id;
    }

    await this.handlerRepository.create(newHandler);

    const { has_internal_error: errorOnItegrateItemOutCart, error_message } =
      await useCaseFactory.execute<void>(this.integrateHandlerUseCase);
    if (errorOnItegrateItemOutCart) {
      throw new Error(error_message || "Falha na conexão");
    }
    return newHandler;
  }
}

export const insertHandler = new InsertHandler();
