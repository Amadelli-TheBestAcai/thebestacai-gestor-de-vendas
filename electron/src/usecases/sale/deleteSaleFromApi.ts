import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import midasApi from "../../providers/midasApi";
import { StoreCashDto } from "../../models/gestor";

interface Request {
  id: string;
}

class DeleteSaleFromApi implements IUseCaseFactory {
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

    await midasApi.delete(`/sales/${id}`);
  }
}

export const deleteSaleFromApi = new DeleteSaleFromApi();
