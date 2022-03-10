import { useCaseFactory } from "../usecases/useCaseFactory";
import { getUser, getAllUser, login } from "../usecases/user";
import { UserDto } from "../models/gestor";

export const userFactory = {
  getUser: async () => await useCaseFactory.execute<UserDto>(getUser),
  getAllUser: async () => await useCaseFactory.execute<UserDto[]>(getAllUser),
  login: async (username: string, password: string) => await useCaseFactory.execute<UserDto>(login, { username, password }),
};
