import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";

class ReasonsToCancel implements IUseCaseFactory {
  constructor(
    private ifoodRepository = new BaseRepository<any>(StorageNames.Ifood)
  ) {}

  async execute(): Promise<void> {
    const hasInternet = await checkInternet();
    if (hasInternet) {
    }
  }
}

export const reasonsToCancel = new ReasonsToCancel();
