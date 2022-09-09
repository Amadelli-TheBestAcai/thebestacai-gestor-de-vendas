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
    const store = await this.storeCashRepository.getOne();

    const payload = {
      sale_id,
      justify,
      store_id: store?.company.id
    }

    const {
      data
    } = await midasApi.post("/nfce/cancel", payload);

    console.log(data)
  }
}

export const cancelNfce = new CancelNfce();
