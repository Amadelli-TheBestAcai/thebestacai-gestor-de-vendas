import handlerModel, { Entity } from "../models/handler";

export const handlerFactory = {
  create: async (payload: Omit<Entity, "id">) =>
    await handlerModel.insert(payload),
  getCashHandlersByStoreCash: async () =>
    await handlerModel.getCashHandlersByStoreCash(),
};
