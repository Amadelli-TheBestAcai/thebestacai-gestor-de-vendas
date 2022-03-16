import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import odinApi from "../../providers/odinApi";
import { StoreCashDto } from "../../models/gestor";
import { AppSaleDTO } from "../../models/dtos/appSale";

class GetSaleFromApp implements IUseCaseFactory {
  constructor(
    private storeCashRepository = new BaseRepository<StoreCashDto>(
      StorageNames.StoreCash
    )
  ) {}

  async execute(): Promise<AppSaleDTO[] | undefined> {
    const is_online = await checkInternet();
    if (!is_online) {
      return [];
    }

    const currentCash = await this.storeCashRepository.getOne();
    if (!currentCash || !currentCash?.is_opened) {
      return undefined;
    }

    const { store_id } = currentCash;
    if (!store_id) {
      return undefined;
    }

    const {
      data: { content },
    } = await odinApi.get(`/app_sale/${store_id}/toIntegrate`);

    return content;
  }
}

export const getSaleFromApp = new GetSaleFromApp();
