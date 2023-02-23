import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { SettingsDto, UserDto } from "../../models/gestor";
import { checkInternet } from "../../providers/internetConnection";
import janusApi from "../../providers/janusApi";
import criptography from "../../providers/Criptography";
import jwt_decode from "jwt-decode";

interface Request {
  username: string;
  password: string;
}

class Login implements IUseCaseFactory {
  constructor(
    private userRepository = new BaseRepository<UserDto>(StorageNames.User),
    private settingsRepository = new BaseRepository<SettingsDto>(StorageNames.Settings)
  ) { }

  async execute({ password, username }: Request): Promise<UserDto | undefined> {
    const hasInternet = await checkInternet();

    if (hasInternet) {
      const {
        data: { access_token, modules, permissions },
      } = await janusApi.post("user/login", { username, password });
      if (!access_token) {
        return undefined;
      }

      const hashedPassword = await criptography.hash(password);
      const userPayload = {
        ...jwt_decode<UserDto>(access_token),
        username,
        password: hashedPassword,
        token: access_token,
        is_actived: true,
        modules,
        permissions
      };

      let users = await this.userRepository.getAll();
      users = users.map((_user) => ({
        ..._user,
        is_actived: false,
      }));

      const userIndex = users.findIndex(
        (_user) => _user.email === userPayload.email
      );

      if (userIndex >= 0) {
        users[userIndex] = userPayload;
        await this.userRepository.clear();
        await this.userRepository.createMany(users);
      } else {
        await this.userRepository.clear();
        await this.userRepository.createMany([...users, userPayload]);
      }
      const settings = await this.settingsRepository.getOne();

      await this.settingsRepository.update(settings?.id, {
        should_open_casher: true
      });

      return userPayload;

    } else {
      let users = await this.userRepository.getAll();
      users = users.map((_user) => ({
        ..._user,
        is_actived: false,
      }));

      const userIndex = users.findIndex((_user) => _user.username === username);

      if (userIndex < 0) {
        return undefined;
      }

      const samePassword = await criptography.compare(
        password,
        users[userIndex].password
      );
      if (!samePassword) {
        return undefined;
      }

      users[userIndex].is_actived = true;
      await this.userRepository.clear();
      await this.userRepository.createMany(users);

      return users[userIndex];
    }
  }
}

export const login = new Login();
