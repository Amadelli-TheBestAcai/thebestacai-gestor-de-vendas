import { useCaseFactory } from "../usecases/useCaseFactory";
import {
  createStore,
  hasRegistration,
  getFromApi,
  removeStore,
} from "../usecases/store";
import { StoreDto } from "../models/gestor";

export const storeFactory = {
  hasRegistration: async () =>
    await useCaseFactory.execute<StoreDto>(hasRegistration),
  getFromApi: async () => useCaseFactory.execute<StoreDto[]>(getFromApi),
  create: async (payload: any) =>
    await useCaseFactory.execute<StoreDto | undefined>(createStore, {
      payload,
    }),
  remove: async () =>
    await useCaseFactory.execute<StoreDto | undefined>(removeStore),
};
