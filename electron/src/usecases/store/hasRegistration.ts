import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { StoreDto } from "../../models/gestor";

class HasRegistration implements IUseCaseFactory {
  constructor(
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store)
  ) {}

  async execute(): Promise<StoreDto | undefined> {
    const store = await this.storeRepository.getOne();
    if (!store) {
      return undefined;
    }
    // this.registratedStore = store;
    return store;
  }
}

export const hasRegistration = new HasRegistration();
