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
  openOnlineStoreCash,
  getOldCashHistory,
  updateStoreCashIsOpened
} from "../usecases/storeCash";
import {
  BalanceDto,
  StoreCashDto,
  AvailableStoreCashesDto,
  OldCashHistoryDto,
} from "../models/gestor";

export const storeCashFactory = {
  getAvailableStoreCashes: async () =>
    await useCaseFactory.execute<AvailableStoreCashesDto[]>(
      getAvailableStoreCashes
    ),
  openOnlineStoreCash: async () =>
    await useCaseFactory.execute<StoreCashDto | undefined>(
      openOnlineStoreCash
    ),
  getOldCashHistory: async () =>
    await useCaseFactory.execute<OldCashHistoryDto | null>(
      getOldCashHistory
    ),
  getCurrent: async () =>
    await useCaseFactory.execute<StoreCashDto>(getCurrentStoreCash),
  openStoreCash: async (amount_on_open: number) =>
    await useCaseFactory.execute<StoreCashDto>(openStoreCash, {
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
  updateStoreCashIsOpened: async (id: string) =>
    await useCaseFactory.execute(updateStoreCashIsOpened, { id }),
};
