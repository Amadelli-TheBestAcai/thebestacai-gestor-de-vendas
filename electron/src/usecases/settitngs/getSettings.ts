import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { SettingsDto } from "../../models/gestor";
import { v4 } from "uuid";

class GetSettings implements IUseCaseFactory {
  constructor(
    private settingsRepository = new BaseRepository<SettingsDto>(
      StorageNames.Settings
    )
  ) {}

  async execute(): Promise<SettingsDto> {
    const _settings = await this.settingsRepository.getOne();
    if (_settings) {
      return _settings;
    } else {
      const payload: SettingsDto = { id: v4() };
      await this.settingsRepository.create(payload);
      return payload;
    }
  }
}
export const getSettings = new GetSettings();
