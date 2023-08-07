import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import { findOrCreate } from "./findOrCreate";

import ifoodApi from "../../providers/ifoodApi";

class GetMerchant implements IUseCaseFactory {
  constructor(
    private ifoodRepository = new BaseRepository<any>(StorageNames.Ifood)
  ) {}

  async execute(): Promise<void> {
    const hasInternet = await checkInternet();
    const ifood = await findOrCreate.execute();
    if (hasInternet && ifood.merchant_id) {
      let { data: merchant } = await ifoodApi.get(
        `/merchant/v1.0/merchants/${ifood.merchant_id}`
      );
      const { data: status } = await ifoodApi.get(
        `merchant/v1.0/merchants//${ifood.merchant_id}/status`
      );

      merchant.status = status;

      await this.ifoodRepository.update(ifood.id, { merchant });
    }
  }
}

export const getMerchant = new GetMerchant();
