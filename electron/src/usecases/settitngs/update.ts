import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { SettingsDto } from "../../models/gestor";

interface Request {
  id: number;
  payload: any;
}

class Update implements IUseCaseFactory {
  constructor(
    private settingsRepository = new BaseRepository<SettingsDto>(
      StorageNames.Settings
    )
  ) {}

  async execute({ id, payload }: Request): Promise<SettingsDto | undefined> {
    return await this.settingsRepository.update(id, payload);
  }
}
export const update = new Update();
