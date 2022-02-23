import storeModel from "../models/store";
import { useCaseFactory } from "../usecases/useCaseFactory";
import { createStore, hasRegistration, getFromApi } from "../usecases/store";
import { StoreDto } from "../models/gestor";

export const storeFactory = {
  registratedStore: () => storeModel.registratedStore,
  getFromApi: async () => useCaseFactory.execute<StoreDto[]>(getFromApi),
  hasRegistration: async () =>
    await useCaseFactory.execute<StoreDto>(hasRegistration),
  create: async (payload: any) =>
    await useCaseFactory.execute<void>(createStore, { payload }),
};
