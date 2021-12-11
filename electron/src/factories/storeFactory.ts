import storeModel from "../models/store";

export const storeFactory = {
  registratedStore: () => storeModel.registratedStore,
  getFromApi: async () => await storeModel.getFromApi(),
  hasRegistration: async () => await storeModel.hasRegistration(),
};
