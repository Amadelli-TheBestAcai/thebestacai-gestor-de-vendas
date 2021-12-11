import { IBaseRepository } from "./baseRepository.interface";
import { LocalStorage } from "node-persist";
import moment from "moment";

export abstract class BaseRepository<T extends { id?: string | number }>
  implements IBaseRepository<T>
{
  private storageName: string;
  private conn: LocalStorage;
  constructor(storageName: string, conn: LocalStorage) {
    this.storageName = storageName;
    this.conn = conn;
  }

  async create(payload: T): Promise<void> {
    await this.conn.updateItem(this.storageName, {
      ...payload,
      created_at: moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
    });
  }

  async createMany(payload: T[]): Promise<void> {
    const response = payload.map((_payload) => ({
      ..._payload,
      created_at: moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
    }));
    await this.conn.setItem(this.storageName, response);
  }

  async getById(id: string | number): Promise<T | undefined> {
    const response: T[] = await this.conn.getItem(this.storageName);
    return response.find((_response: T) => _response.id === id);
  }

  async deleteById(id: string | number): Promise<void> {
    const data: T[] = await this.conn.getItem(this.storageName);
    const response = data.filter((_entity) => _entity.id === id);
    await this.conn.setItem(this.storageName, response);
  }

  async update(id: string | number, payload: T): Promise<void> {
    const data: T[] = await this.conn.getItem(this.storageName);
    const entityIndex = data.findIndex((_entity) => _entity.id === id);
    data[entityIndex] = {
      ...data[entityIndex],
      ...payload,
    };
    await this.conn.setItem(this.storageName, data);
  }

  async getAll(): Promise<T[]> {
    const response = await this.conn.getItem(this.storageName);
    return response || [];
  }

  async clear(): Promise<void> {
    await this.conn.removeItem(this.storageName);
  }
}
