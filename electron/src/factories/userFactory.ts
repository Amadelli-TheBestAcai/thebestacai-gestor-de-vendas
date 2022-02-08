import userModel, { Entity } from "../models/user";

export const userFactory = {
  getUser: async (): Promise<Entity | undefined> => await userModel.get(),
  hasPermission: (permission: string) => userModel.hasPermission(permission),
  getAll: async () => await userModel.getAll(),
  login: async (
    username: string,
    password: string
  ): Promise<{ user: Entity | undefined; error?: string }> => {
    try {
      const user = await userModel.login(username, password);
      return {
        user,
      };
    } catch (error: any) {
      if (error?.response) {
        if (error?.response?.data?.message) {
          return {
            user: undefined,
            error: error?.response?.data?.message,
          };
        }
      }
      return {
        user: undefined,
        error: "Falha ao realizar login",
      };
    }
  },
};
