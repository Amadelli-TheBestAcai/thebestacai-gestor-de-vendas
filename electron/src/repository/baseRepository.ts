import { IBaseRepository } from "./baseRepository.interface";
import Datastore from 'nedb-async'
import database from "../../src/providers/database";
import moment from "moment";
import { v4 } from "uuid";

export class BaseRepository<T extends { id?: string | number }>
  implements IBaseRepository<T>
{
  private storageName: string;
  private dataStore: Datastore<T>;
  constructor(storageName: string) {
    this.storageName = storageName;
    this.dataStore = database.getConnection<T>(this.storageName)
  }

  async create(payload: T): Promise<T> {
    const entity: T = {
      ...payload,
      id: payload?.id || v4(),
      created_at: moment(new Date()).format("yyyy-MM-DD'T'HH:mm:ss"),
    };
    await this.dataStore.asyncInsert(entity)
    return entity;
  }

  async createMany(payload: T[]): Promise<void> {
    const response = payload.map((_payload) => ({
      ..._payload,
      created_at: moment(new Date()).format("yyyy-MM-DD'T'HH:mm:ss"),
    }));
    await Promise.all(
      response.map(async entity => await this.dataStore.asyncInsert(entity))
    )
  }

  async createManyAndReplace(payload: T[]): Promise<void> {
    const response = payload.map((_payload) => ({
      ..._payload,
      created_at: moment(new Date()).format("yyyy-MM-DD'T'HH:mm:ss"),
    }));
    await this.dataStore.asyncRemove({}, { multi: true })
    await Promise.all(
      response.map(async entity => await this.dataStore.asyncInsert(entity))
    )
  }

  async getById(id: string | number): Promise<T | undefined> {
    return await this.dataStore.asyncFindOne({ id })
  }

  async deleteById(id: string | number): Promise<void> {
    await this.dataStore.asyncRemove({ id })
  }

  async update(
    id: string | number | undefined,
    payload: Partial<T>
  ): Promise<T | undefined> {
    if (!id) {
      return;
    }
    const t = await this.dataStore.asyncUpdate({ id }, payload)
    return await this.dataStore.asyncFindOne({ id })
  }

  async getAll(): Promise<T[]> {
    const response = await this.dataStore.asyncFind({})
    return response || []
  }

  async getOne(): Promise<T | undefined> {
    const response = await this.dataStore.asyncFind({})
    return (response && response[0]) || undefined;
  }

  async clear(): Promise<void> {
    await this.dataStore.asyncRemove({}, { multi: true })
  }
}
