import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import odinApi from "../../providers/odinApi";
import { checkInternet } from "../../providers/internetConnection";
import { StoreDto, StoreCashDto } from "../../models/gestor";
import { updateBalanceHistory } from './updateBalanceHistory'
import { useCaseFactory } from "../useCaseFactory";
interface Request {
  code: string;
  amount_on_close: number;
}

class CloseStoreCash implements IUseCaseFactory {
  constructor(
    private storeCashRepository = new BaseRepository<StoreCashDto>(
      StorageNames.StoreCash
    ),
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store),
    private _updateBalanceHistory = updateBalanceHistory
  ) { }

  async execute({
    amount_on_close,
    code,
  }: Request): Promise<StoreCashDto | undefined> {
    const isConnected = await checkInternet();
    if (isConnected) {
      const { has_internal_error: errorOnUpdateBalanceHistory } =
        await useCaseFactory.execute<StoreCashDto>(this._updateBalanceHistory)

      if (errorOnUpdateBalanceHistory) {
        throw new Error("Falha ao atualizar o histórico do caixa");
      }

      const currentStore = await this.storeRepository.getOne();

      await odinApi.put(
        `/store_cashes/${currentStore?.company_id}-${code}/close`,
        { amount_on_close: +amount_on_close?.toString() || 0 }
      );
    }
    const storeCash = await this.storeCashRepository.getOne();
    const updatedStoreCash = await this.storeCashRepository.update(
      storeCash?.id,
      {
        is_opened: false,
      }
    );
    return updatedStoreCash;
  }
}

export const closeStoreCash = new CloseStoreCash();
