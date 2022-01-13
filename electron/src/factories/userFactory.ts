import userModel, { Entity } from "../models/user";

export const userFactory = {
  getUser: async (): Promise<Entity | undefined> => await userModel.get(),
  hasPermission: (permission: string) => userModel.hasPermission(permission),
  getAll: async () => await userModel.getAll(),
  login: async (username: string, password: string) =>
    await userModel.login(username, password),
};
