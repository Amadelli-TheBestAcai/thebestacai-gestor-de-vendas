import settingsModel, { Entity } from "../models/settings";
import { useCaseFactory } from "../usecases/useCaseFactory";
import { getSettings } from "../usecases/settitngs";
import { SettingsDto } from "../models/gestor";

export const settingsFactory = {
  getSettings: async () =>
    await useCaseFactory.execute<SettingsDto>(getSettings),
  getPrinters: () => settingsModel.getPrinters(),
  update: async (id: string, payload: Partial<Entity>) =>
    (await settingsModel.update(id, payload)) as Entity,
};
