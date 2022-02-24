import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";

import odinApi from "../../providers/odinApi";
import { checkInternet } from "../../providers/internetConnection";
import { StoreCashDto } from "../../models/gestor";

interface Request {
  id: number;
}

class DeleteCashHandlerFromApiService implements IUseCaseFactory {
  constructor(
    private storeCashRepository = new BaseRepository<StoreCashDto>(
      StorageNames.StoreCash
    )
  ) {}

  async execute({ id }: Request): Promise<void> {
    const is_online = await checkInternet();
    if (!is_online) {
      return;
    }

    const currentCash = await this.storeCashRepository.getOne();
    if (!currentCash || !currentCash.is_opened) {
      return;
    }

    const { store_id, code } = currentCash;
    if (!store_id || !code) {
      return;
    }

    await odinApi.delete(`/cash_handler/${id}`);
  }
}

export const deleteCashHandlerFromApiService =
  new DeleteCashHandlerFromApiService();
