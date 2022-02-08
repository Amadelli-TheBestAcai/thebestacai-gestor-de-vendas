import settingsModel, { Entity } from "../models/settings";

export const settingsFactory = {
  getSettings: async () => await settingsModel.getSettings(),
  update: async (id: string, payload: Partial<Entity>) =>
    (await settingsModel.update(id, payload)) as Entity,
};
