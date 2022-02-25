import { useCaseFactory } from "../usecases/useCaseFactory";
import { getUser, getAllUser, login } from "../usecases/user";
import { UserDto } from "../models/gestor";

export const userFactory = {
  getUser: async () => await useCaseFactory.execute<UserDto>(getUser),
  getAllUser: async () => await useCaseFactory.execute<UserDto[]>(getAllUser),
  login: async (username: string, password: string) => {
    try {
      const user = await useCaseFactory.execute<{
        user: UserDto | undefined;
        error?: string;
      }>(login, { username, password });
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
