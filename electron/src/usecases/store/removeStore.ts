import { BaseRepository } from "../../repository/baseRepository";
import { StoreDto } from "../../models/gestor";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";

class RemoveStore implements IUseCaseFactory {
  constructor(
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store)
  ) {}

  async execute(): Promise<void> {
    await this.storeRepository.clear();
  }
}

export const removeStore = new RemoveStore();
