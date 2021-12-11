import storeModel, { Entity } from "../models/store";

export const storeFactory = {
  registratedStore: () => storeModel.registratedStore,
  getFromApi: async () => await storeModel.getFromApi(),
  hasRegistration: async () => await storeModel.hasRegistration(),
  create: async (payload: any) => await storeModel.create(payload),
};
