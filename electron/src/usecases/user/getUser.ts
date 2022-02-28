import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { UserDto } from "../../models/gestor";

class GetUser implements IUseCaseFactory {
  constructor(
    private userRepository = new BaseRepository<UserDto>(StorageNames.User)
  ) {}

  async execute(): Promise<UserDto | undefined> {
    const users = await this.userRepository.getAll();
    return users.find((_user) => _user.is_actived);
  }
}

export const getUser = new GetUser();
