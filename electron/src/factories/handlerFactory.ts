import handlerModel, { Entity } from "../models/handler";

export const handlerFactory = {
  create: async (payload: Omit<Entity, "id">) =>
    await handlerModel.insert(payload),
  getCashHandlersByStoreCash: async () =>
    await handlerModel.getCashHandlersByStoreCash(),
  deleteCashHandlerFromApiService: async (id: number) => {
    try {
      await handlerModel.deleteCashHandlerFromApiService(id);
      return true;
    } catch {
      return false;
    }
  },
};
