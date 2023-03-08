import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { OldCashHistoryDto } from "../../models/gestor";

class GetOldCashHistory implements IUseCaseFactory {
  constructor(
    private oldCashHistoryRepository = new BaseRepository<OldCashHistoryDto>(
      StorageNames.Old_Cash_History
    )
  ) { }
  async execute(): Promise<OldCashHistoryDto | undefined> {
    return await this.oldCashHistoryRepository.getOne();
  }
}

export const getOldCashHistory = new GetOldCashHistory();
