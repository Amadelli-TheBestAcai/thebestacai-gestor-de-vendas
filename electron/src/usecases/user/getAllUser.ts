import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { UserDto } from "../../models/gestor";

class GetAllUser implements IUseCaseFactory {
  constructor(
    private userRepository = new BaseRepository<UserDto>(StorageNames.User)
  ) {}

  async execute(): Promise<UserDto[]> {
    const users = await this.userRepository.getAll();
    if (!users) {
      throw new Error("Nenhum usuário encontrado");
    }
    return users;
  }
}

export const getAllUser = new GetAllUser();
