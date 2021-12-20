import { IBaseRepository } from "./baseRepository.interface";
import database from "../../src/providers/database";
import moment from "moment";
import { v4 } from "uuid";

export abstract class BaseRepository<T extends { id?: string | number }>
  implements IBaseRepository<T>
{
  private storageName: string;
  constructor(storageName: string) {
    this.storageName = storageName;
  }

  async create(payload: T): Promise<void> {
    const entities =
      (await database.getConnection().getItem(this.storageName)) || [];
    await database.getConnection().setItem(this.storageName, [
      ...entities,
      {
        ...payload,
        id: payload?.id || v4(),
        created_at: moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
      },
    ]);
  }

  async createMany(payload: T[]): Promise<void> {
    const response = payload.map((_payload) => ({
      ..._payload,
      created_at: moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
    }));
    await database.getConnection().setItem(this.storageName, response);
  }

  async getById(id: string | number): Promise<T | undefined> {
    const response: T[] = await database
      .getConnection()
      .getItem(this.storageName);
    return response.find((_response: T) => _response.id === id);
  }

  async deleteById(id: string | number): Promise<void> {
    const data: T[] = await database.getConnection().getItem(this.storageName);
    const response = data.filter((_entity) => _entity.id === id);
    await database.getConnection().setItem(this.storageName, response);
  }

  async update(
    id: string | number | undefined,
    payload
  ): Promise<T | undefined> {
    if (!id) {
      return;
    }
    const data: T[] = await database.getConnection().getItem(this.storageName);
    const entityIndex = data.findIndex((_entity) => _entity.id === id);
    data[entityIndex] = {
      ...data[entityIndex],
      ...payload,
    };
    await database.getConnection().setItem(this.storageName, data);
    return data[entityIndex];
  }

  async getAll(): Promise<T[]> {
    const response = await database.getConnection().getItem(this.storageName);
    return response || [];
  }

  async getOne(): Promise<T | undefined> {
    const response = await database.getConnection().getItem(this.storageName);
    return (response && response[0]) || undefined;
  }

  async clear(): Promise<void> {
    await database.getConnection().removeItem(this.storageName);
  }
}
