import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { StoreCashDto, StoreDto } from "../../models/gestor";

class GetCurrentStoreCash implements IUseCaseFactory {
  constructor(
    private storeCashRepository = new BaseRepository<StoreCashDto>(
      StorageNames.StoreCash
    ),
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store)
  ) {}
  async execute(): Promise<StoreCashDto | undefined> {
    let storeCash = await this.storeCashRepository.getOne();

    const store = await this.storeRepository.getOne();
    if (storeCash && store) {
      storeCash.store_id = store.company_id;
      await this.storeCashRepository.update(storeCash.id, storeCash);
    }

    return storeCash;
  }
}

export const getCurrentStoreCash = new GetCurrentStoreCash();
