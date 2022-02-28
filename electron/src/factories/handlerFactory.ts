import { useCaseFactory } from "../usecases/useCaseFactory";
import {
  deleteCashHandlerFromApiService,
  getCashHandlersByStoreCash,
  insertHandler,
} from "../usecases/handler";
import { HandlerDto } from "../models/gestor";
import { CashHandlerDTO } from "../models/dtos";

export const handlerFactory = {
  create: async (payload: any) =>
    await useCaseFactory.execute<HandlerDto>(insertHandler, { payload }),
  getCashHandlersByStoreCash: async () =>
    await useCaseFactory.execute<CashHandlerDTO>(getCashHandlersByStoreCash),
  deleteCashHandlerFromApiService: async (id: number) =>
    await useCaseFactory.execute<void>(deleteCashHandlerFromApiService, {
      id,
    })
};
