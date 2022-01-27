import { BaseRepository } from "../repository/baseRepository";
import jwt_decode from "jwt-decode";
import janusApi from "../providers/janusApi";
import criptography from "../providers/Criptography";
import { checkInternet } from "../providers/internetConnection";

export type Entity = {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  level: number;
  image: string;
  token: string;
  is_actived: boolean;
  permissions: string[];
};

class User extends BaseRepository<Entity> {
  loggedUser: Entity | null = null;
  constructor(storageName = "User") {
    super(storageName);
  }

  async login(username: string, password: string): Promise<Entity | undefined> {
    const hasInternet = await checkInternet();
    if (hasInternet) {
      const {
        data: { access_token },
      } = await janusApi.post("user/login", { username, password });
      if (!access_token) {
        return undefined;
      }
      const hashedPassword = await criptography.hash(password);
      const userPayload = {
        ...jwt_decode<Entity>(access_token),
        username,
        password: hashedPassword,
        token: access_token,
        is_actived: true,
      };
      this.loggedUser = userPayload;

      let users = await this.getAll();
      users = users.map((_user) => ({
        ..._user,
        is_actived: false,
      }));

      const userIndex = users.findIndex(
        (_user) => _user.email === userPayload.email
      );

      if (userIndex >= 0) {
        users[userIndex] = userPayload;
        await this.createMany(users);
      } else {
        await this.createMany([...users, userPayload]);
      }

      return userPayload;
    } else {
      let users = await this.getAll();
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
      this.loggedUser = users[userIndex];
      await this.createMany(users);

      return users[userIndex];
    }
  }

  async get(): Promise<Entity | undefined> {
    const users = await this.getAll();
    return users.find((_user) => _user.is_actived);
  }

  hasPermission(permission: string): boolean {
    return this.loggedUser
      ? this.loggedUser.permissions.some(
          (_permission) => _permission === permission
        )
      : false;
  }
}

export default new User();
