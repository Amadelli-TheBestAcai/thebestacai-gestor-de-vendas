import { StoreCashHistoryDTO } from "../models/dtos/storeCashHistory";
import { useCaseFactory } from "../usecases/useCaseFactory";
import {
  getCurrentStoreCash,
  getStoreCashBalance,
  closeStoreCash,
  openStoreCash,
  getAvailableStoreCashes,
  getStoreCashHistory,
  updateStoreCashObservation,
} from "../usecases/storeCash";
import {
  BalanceDto,
  StoreCashDto,
  AvailableStoreCashesDto,
} from "../models/gestor";

export const storeCashFactory = {
  getAvailableStoreCashes: async () =>
    await useCaseFactory.execute<AvailableStoreCashesDto[]>(
      getAvailableStoreCashes
    ),
  getCurrent: async () =>
    await useCaseFactory.execute<StoreCashDto>(getCurrentStoreCash),
  openStoreCash: async (code: string, amount_on_open: number) =>
    await useCaseFactory.execute<StoreCashDto>(openStoreCash, {
      code,
      amount_on_open,
    }),
  closeStoreCash: async (code: string, amount_on_close: number) =>
    await useCaseFactory.execute<StoreCashDto>(closeStoreCash, {
      code,
      amount_on_close,
    }),
  getStoreCashBalance: async () =>
    await useCaseFactory.execute<BalanceDto>(getStoreCashBalance),
  getStoreCashHistory: async () =>
    await useCaseFactory.execute<StoreCashHistoryDTO | undefined>(
      getStoreCashHistory
    ),
  updateStoreCashObservation: async (observation: string) =>
    await useCaseFactory.execute(updateStoreCashObservation, { observation }),
};
