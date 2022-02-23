import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import odinApi from "../../providers/odinApi";
import { StoreCashDto } from "../../models/gestor";
import { AppSaleDTO } from "../../models/dtos/appSale";

interface Request {
  withClosedCash: false;
}

class GetSaleFromApp implements IUseCaseFactory {
  constructor(
    private storeCashRepository = new BaseRepository<StoreCashDto>(
      StorageNames.StoreCash
    )
  ) {}

  async execute(): Promise<AppSaleDTO[]> {
    const is_online = await checkInternet();
    if (!is_online) {
      return [];
    }

    const currentCash = await this.storeCashRepository.getOne();
    if (!currentCash || !currentCash?.is_opened) {
      throw new Error("Caixa fechado");
    }

    const { store_id } = currentCash;
    if (!store_id) {
      throw new Error("Id da loja não encontrado");
    }

    const {
      data: { content },
    } = await odinApi.get(`/app_sale/${store_id}/toIntegrate`);

    return content;
  }
}

export const getSaleFromApp = new GetSaleFromApp();