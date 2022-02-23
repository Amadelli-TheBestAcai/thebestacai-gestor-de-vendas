import userModel, { Entity } from "../models/user";
import { useCaseFactory } from "../usecases/useCaseFactory";
import { getUser } from "../usecases/user";
import { UserDto } from "../models/gestor";

export const userFactory = {
  getUser: async () => await useCaseFactory.execute<UserDto>(getUser),
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
