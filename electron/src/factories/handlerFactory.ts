import { useCaseFactory } from "../usecases/useCaseFactory";
import {
  deleteCashHandlerFromApiService,
  getCashHandlersByStoreCash,
  insertHandler,
  getLocalCashHandlers,
  integrateHandler
} from "../usecases/handler";
import { HandlerDto } from "../models/gestor";
import { CashHandlerDTO } from "../models/dtos";
import { synchronizeCashHandler } from "../usecases/handler/synchronizeCashHandler";

export const handlerFactory = {
  create: async (payload: any) =>
    await useCaseFactory.execute<HandlerDto>(insertHandler, { payload }),
  getCashHandlersByStoreCash: async () =>
    await useCaseFactory.execute<CashHandlerDTO>(getCashHandlersByStoreCash),
  deleteCashHandlerFromApiService: async (id: number) =>
    await useCaseFactory.execute<void>(deleteCashHandlerFromApiService, {
      id,
    }),
  getLocalCashHandlers: async () =>
    await useCaseFactory.execute<HandlerDto[]>(getLocalCashHandlers),
  integrateHandler: async () =>
    await useCaseFactory.execute<void>(integrateHandler),
  synchronizeCashHandler: async () =>
    await useCaseFactory.execute<void>(synchronizeCashHandler)
};
