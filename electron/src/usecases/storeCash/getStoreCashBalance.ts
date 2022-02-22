import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import midasApi from "../../providers/midasApi";
import { checkInternet } from "../../providers/internetConnection";
import { StoreCashDto } from "../../models/dtos/storeCash";
import { BalanceDto } from "../../models/gestor";
import { getBalance } from "../../helpers/BalanceFormater";

interface Request {
  withClosedCash: false;
}

class GetStoreCashBalance implements IUseCaseFactory {
  constructor(
    private storeCashRepository = new BaseRepository<StoreCashDto>(
      StorageNames.StoreCash
    )
  ) {}
  async execute({ withClosedCash }: Request): Promise<BalanceDto | undefined> {
    const isConnected = await checkInternet();
    if (!isConnected) {
      return undefined;
    }

    const currentCash = await this.storeCashRepository.getOne();
    if (!currentCash) {
      return undefined;
    }

    if (!withClosedCash && !currentCash?.is_opened) {
      return undefined;
    }

    const { store_id, code } = currentCash;
    if (!store_id || !code) {
      return undefined;
    }

    const { data } = await midasApi.get(`/sales/${store_id}-${code}/history`);
    const balance = getBalance(data);
    return balance;
  }
}

export const getStoreCashBalance = new GetStoreCashBalance();
