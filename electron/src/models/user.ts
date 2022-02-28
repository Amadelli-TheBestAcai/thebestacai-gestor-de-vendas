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

  async get(): Promise<Entity | undefined> {
    const users = await this.getAll();
    return users.find((_user) => _user.is_actived);
  }
}

export default new User();
