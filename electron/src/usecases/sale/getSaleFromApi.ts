import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import midasApi from "../../providers/midasApi";
import { StoreCashDto } from "../../models/gestor";
import { SaleFromApiDTO } from "../../models/dtos/salesFromApi";

interface Request {
  withClosedCash: false;
}

class GetSaleFromApi implements IUseCaseFactory {
  constructor(
    private storeCashRepository = new BaseRepository<StoreCashDto>(
      StorageNames.Sale
    )
  ) {}

  async execute({ withClosedCash }: Request): Promise<SaleFromApiDTO[]> {
    const is_online = await checkInternet();
    if (!is_online) {
      return [];
    }

    const currentCash = await this.storeCashRepository.getOne();
    if (!currentCash) {
      return [];
    }

    if (!withClosedCash && !currentCash?.is_opened) {
      return [];
    }

    const { store_id, code } = currentCash;
    if (!store_id || !code) {
      return [];
    }

    const { data } = await midasApi.get(`/sales/${store_id}-${code}/history`);
    return data;
  }
}

export const getSaleFromApi = new GetSaleFromApi();
