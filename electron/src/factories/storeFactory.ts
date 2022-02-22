import storeModel, { Entity } from "../models/store";
import { useCaseFactory } from "../usecases/useCaseFactory";
import { createStore } from "../usecases/store";

export const storeFactory = {
  registratedStore: () => storeModel.registratedStore,
  getFromApi: async () => await storeModel.getFromApi(),
  hasRegistration: async () => await storeModel.hasRegistration(),
  create: async (payload: any) =>
    await useCaseFactory.execute(createStore, { payload }),
};
