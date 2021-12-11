import { BaseRepository } from "../repository/baseRepository";
import jwt_decode from "jwt-decode";
import database from "../providers/database";
import janusApi from "../providers/janusApi";

type Entity = {
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
  constructor(storageName = "User", conn = database.getConnection()) {
    super(storageName, conn);
    console.log("CurrentUser ready");
  }

  batata(): void {
    console.log("batata");
  }

  async login(username: string, password: string): Promise<Entity | undefined> {
    const {
      data: { access_token },
    } = await janusApi.post("user/login", { username, password });
    if (!access_token) {
      return undefined;
    }
    const userPayload = {
      ...jwt_decode<Entity>(access_token),
      username,
      password,
      token: access_token,
      is_actived: true,
    };

    let users = await this.getAll();

    users = users.map((_user) => ({
      ..._user,
      is_actived: false,
      token: access_token,
    }));

    const userIndex = users.findIndex(
      (_user) => _user.username === username && _user.password === password
    );

    if (userIndex >= 0) {
      users[userIndex] = userPayload;
      await this.createMany(users);
    } else {
      await this.createMany([...users, userPayload]);
    }

    return userPayload;
  }

  async get(): Promise<Entity | undefined> {
    const users = await this.getAll();
    return users.find((_user) => _user.is_actived);
  }
}

export default new User();
