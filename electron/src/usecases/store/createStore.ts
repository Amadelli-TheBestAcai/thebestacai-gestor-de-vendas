import { BaseRepository } from "../../repository/baseRepository";
import { StoreDto } from "../../models/gestor/store";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";

interface Request {
  payload: any;
}

class CreateStore implements IUseCaseFactory {
  constructor(
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store)
  ) {}

  async execute({ payload }: Request): Promise<void> {
    await this.storeRepository.create(payload);
  }
}

export const createStore = new CreateStore();
