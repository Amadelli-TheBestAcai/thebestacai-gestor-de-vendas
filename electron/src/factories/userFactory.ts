import userModel from "../models/user";

export const userFactory = {
  loggedUser: () => userModel.loggedUser,
  hasPermission: (permission: string) => userModel.hasPermission(permission),
  getAll: async () => await userModel.getAll(),
  login: async (username: string, password: string) =>
    await userModel.login(username, password),
};
