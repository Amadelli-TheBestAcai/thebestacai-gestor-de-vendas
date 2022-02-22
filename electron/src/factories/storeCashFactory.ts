import storeCashModel from "../models/storeCash";
import { useCaseFactory } from "../usecases/useCaseFactory";
import {
  getCurrentStoreCash,
  getStoreCashBalance,
} from "../usecases/storeCash";
import { StoreCashDto } from "../models/dtos/storeCash";
import { BalanceDto } from "../models/gestor";

export const storeCashFactory = {
  getAvailableStoreCashes: async () =>
    await storeCashModel.getAvailableStoreCashes(),
  getCurrent: async () =>
    await useCaseFactory.execute<StoreCashDto>(getCurrentStoreCash),
  openStoreCash: async (
    code: string,
    amount_on_open: number
  ): Promise<StoreCashDto | undefined> =>
    await storeCashModel.openStoreCash(code, amount_on_open),
  closeStoreCash: async (
    code: string,
    amount_on_open: number
  ): Promise<StoreCashDto | undefined> =>
    await storeCashModel.closeStoreCash(code, amount_on_open),

  getStoreCashBalance: async (withClosedCash = false) =>
    await useCaseFactory.execute<BalanceDto>(getStoreCashBalance, {
      withClosedCash,
    }),

  getStoreCashHistoryService: async () =>
    await storeCashModel.getStoreCashHistoryService(),
  updateStoreCashObservation: async (observation: string) =>
    await storeCashModel.updateStoreCashObservation(observation),
};
