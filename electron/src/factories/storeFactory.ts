import storeModel from "../models/store";
import { useCaseFactory } from "../usecases/useCaseFactory";
import { createStore, hasRegistration, getFromApi } from "../usecases/store";
import { StoreDto } from "../models/gestor";

export const storeFactory = {
  registratedStore: () => storeModel.registratedStore,
  hasRegistration: async () => await storeModel.hasRegistration(),
  getFromApi: async () => useCaseFactory.execute<StoreDto[]>(getFromApi),
  create: async (payload: any) =>
    await useCaseFactory.execute<void>(createStore, { payload }),
};
