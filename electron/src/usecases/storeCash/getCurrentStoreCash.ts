import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { StoreCashDto } from "../../models/gestor";

class GetCurrentStoreCash implements IUseCaseFactory {
  constructor(
    private storeCashRepository = new BaseRepository<StoreCashDto>(
      StorageNames.StoreCash
    )
  ) {}
  async execute(): Promise<StoreCashDto | undefined> {
    return await this.storeCashRepository.getOne();
  }
}

export const getCurrentStoreCash = new GetCurrentStoreCash();
