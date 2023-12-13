import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { StoreDto } from "../../models/gestor";

import midasApi from "../../providers/midasApi";

interface Request {
  sale_id: number,
  justify?: string
}

class CancelNfce implements IUseCaseFactory {
  constructor(
    private storeCashRepository = new BaseRepository<StoreDto>(
      StorageNames.Store
    ),
  ) { }

  async execute({ sale_id, justify }: Request): Promise<void> {
    try {
      const store = await this.storeCashRepository.getOne();

      const payload = {
        sale_id,
        justify,
        store_id: store?.company.id
      }
      await midasApi.post("/nfce/cancel", payload);

    } catch (error: any) {
      console.log(error);
      throw new Error(error.response.data.message)
    }
  }
}

export const cancelNfce = new CancelNfce();
