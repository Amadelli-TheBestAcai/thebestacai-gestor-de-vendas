import { IBaseRepository } from "./baseRepository.interface";
import Datastore from "nedb-async";
import database from "../../src/providers/database";
import moment from "moment";
import { v4 } from "uuid";

export class BaseRepository<T extends { id?: string | number }>
  implements IBaseRepository<T> {
  private storageName: string;
  private dataStore: Datastore<T>;
  constructor(storageName: string) {
    this.storageName = storageName;
    this.dataStore = database.getConnection<T>(this.storageName);
  }

  async create(payload: T): Promise<T> {
    const entity: T = {
      ...payload,
      id: payload?.id || v4(),
      created_at: moment(new Date()).format("yyyy-MM-DDTHH:mm:ss"),
    };
    await this.dataStore.asyncInsert(entity);
    return entity;
  }

  async createMany(payload: T[]): Promise<void> {
    const response = payload.map((_payload) => ({
      ..._payload,
      created_at: moment(new Date()).format("yyyy-MM-DDTHH:mm:ss"),
    }));
    await Promise.all(
      response.map(async (entity) => await this.dataStore.asyncInsert(entity))
    );
  }

  async createManyAndReplace(payload: T[]): Promise<void> {
    const response = payload.map((_payload) => ({
      ..._payload,
      created_at: moment(new Date()).format("yyyy-MM-DDTHH:mm:ss"),
    }));
    await this.dataStore.asyncRemove({}, { multi: true });
    await Promise.all(
      response.map(async (entity) => await this.dataStore.asyncInsert(entity))
    );
  }

  async getById(id: string | number): Promise<T | undefined> {
    return await this.dataStore.asyncFindOne({ id });
  }

  async deleteById(id: string | number): Promise<void> {
    await this.dataStore.asyncRemove({ id });
  }

  async update(
    id: string | number | undefined,
    payload: Partial<T>
  ): Promise<T | undefined> {
    if (!id) {
      return;
    }
    const entity = await this.dataStore.asyncFindOne({ id });
    const updatedEntity = { ...entity, ...payload };
    await this.dataStore.asyncUpdate({ id }, updatedEntity);
    return await this.dataStore.asyncFindOne({ id });
  }

  async upsert(
    criteria: Partial<T>,
    payload: Partial<T>
  ): Promise<T> {
    const entity = await this.dataStore.asyncFindOne(criteria);

    if (entity) {
      const updatedEntity = { ...entity, ...payload };
      await this.dataStore.asyncUpdate(criteria, updatedEntity);
      return (await this.dataStore.asyncFindOne(criteria)) as T;
    } else {
      const newEntity: T = {
        ...(payload as T),
        id: payload?.id || v4(),
        created_at: moment(new Date()).format("yyyy-MM-DDTHH:mm:ss"),
      };
      await this.dataStore.asyncInsert(newEntity);
      return newEntity;
    }
  }


  async getAll(payload?: Partial<T> | any): Promise<T[]> {
    if (payload) {
      const response = await this.dataStore.asyncFind(payload);
      return response || [];
    }
    const response = await this.dataStore.asyncFind({});
    return response || [];
  }

  async getOne(criteria?: Partial<T>): Promise<T | undefined> {
    if (criteria) {
      return await this.dataStore.asyncFindOne(criteria);
    }
    const response = await this.dataStore.asyncFind({});
    return (response && response[0]) || undefined;
  }

  async clear(): Promise<void> {
    await this.dataStore.asyncRemove({}, { multi: true });
  }
}
