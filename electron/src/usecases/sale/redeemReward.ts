import thorApi from "../../providers/thorApi";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { checkInternet } from "../../providers/internetConnection";
import { ProductDto } from "../../models/gestor";
import { BaseRepository } from "../../repository/baseRepository";
import { StorageNames } from "../../repository/storageNames";

interface Request {
  id: number,
  payload: {
    store_id: number;
    user_id: number;
    user_name: string;
    company_name: string;
  };
}

class RedeemReward implements IUseCaseFactory {
  async execute({ id, payload }: Request): Promise<void> {
    const hasInternet = await checkInternet();
    if (hasInternet) {
      await thorApi.post(`/customer-reward/redeem-reward/${id}`, payload);
    }
  }
}

export const redeemReward = new RedeemReward();
