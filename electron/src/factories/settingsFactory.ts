import settingsModel from "../models/settings";
import { useCaseFactory } from "../usecases/useCaseFactory";
import { getSettings, update } from "../usecases/settings";
import { SettingsDto } from "../models/gestor";

export const settingsFactory = {
  getSettings: async () =>
    await useCaseFactory.execute<SettingsDto>(getSettings),
  update: async (id: string, payload: any) =>
    useCaseFactory.execute<SettingsDto>(update, { id, payload }),
  getPrinters: () => settingsModel.getPrinters(),
};
