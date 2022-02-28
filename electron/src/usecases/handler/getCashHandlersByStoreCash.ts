import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";

import odinApi from "../../providers/odinApi";
import { checkInternet } from "../../providers/internetConnection";
import { StoreCashDto } from "../../models/gestor";
import { CashHandlerDTO } from "../../models/dtos";

class GetCashHandlersByStoreCash implements IUseCaseFactory {
  constructor(
    private storeCashRepository = new BaseRepository<StoreCashDto>(
      StorageNames.StoreCash
    )
  ) {}

  async execute(): Promise<CashHandlerDTO> {
    const isConnected = await checkInternet();
    if (!isConnected) {
      return {
        handlers: [],
      };
    }

    const currentCash = await this.storeCashRepository.getOne();
    if (!currentCash || !currentCash.is_opened) {
      return {
        handlers: [],
      };
    }

    const { store_id, code } = currentCash;
    if (!store_id || !code) {
      return {
        handlers: [],
      };
    }
    const {
      data: { data },
    } = await odinApi.get(`/cash_handler/${store_id}-${code}`);

    return {
      history_id: currentCash.history_id,
      handlers: data,
    };
  }
}

export const getCashHandlersByStoreCash = new GetCashHandlersByStoreCash();
