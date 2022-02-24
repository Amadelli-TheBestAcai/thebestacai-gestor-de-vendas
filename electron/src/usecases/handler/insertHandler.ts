import { v4 } from "uuid";

import { useCaseFactory } from "../useCaseFactory";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { BaseRepository } from "../../repository/baseRepository";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";

import odinApi from "../../providers/odinApi";
import { getCurrentStoreCash } from "../storeCash/getCurrentStoreCash";
import { integrateHandler } from "./integrateHandler";
import { HandlerDto, StoreCashDto } from "../../models/gestor";

interface Request {
  payload: any;
}

class InsertHandler implements IUseCaseFactory {
  constructor(
    private handlerRepository = new BaseRepository<HandlerDto>(
      StorageNames.Handler
    ),
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

    const hasInternet = await checkInternet();

    let order_id = undefined;
    if (hasInternet && payload.sendToShop) {
      const {
        data: { id: orderId },
      } = await odinApi.post("/purchases", payload.shopOrder);
      order_id = orderId;
    }

    const newHandler: HandlerDto = {
      id: v4(),
      ...payload,
    };

    newHandler.cashHandler = {
      ...newHandler.cashHandler,
      id: v4(),
      cash_id: currentCash.cash_id,
      cash_code: currentCash.code,
      store_id: currentCash.store_id,
      cash_history_id: currentCash?.history_id,
      to_integrate: true,
      order_id,
      reason: !payload.cashHandler.reason
        ? "Outros"
        : payload.cashHandler.reason,
    };

    await this.handlerRepository.create(newHandler);

    const { has_internal_error: errorOnItegrateItemOutCart } =
      await useCaseFactory.execute<void>(this.integrateHandlerUseCase);
    if (errorOnItegrateItemOutCart) {
      throw new Error("Falha na conexão");
    }
    return newHandler;
  }
}

export const insertHandler = new InsertHandler();