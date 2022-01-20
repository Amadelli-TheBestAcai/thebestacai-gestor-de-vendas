export interface IBaseRepository<T> {
  create(payload: T): Promise<void>;
  createMany(payload: T[]): Promise<void>;
  getById(id: string | number): Promise<T | undefined>;
  deleteById(id: string | number): Promise<void>;
  update(
    id: string | number | undefined,
    payload: Partial<T>
  ): Promise<T | undefined>;
  getAll(): Promise<T[]>;
  getOne(): Promise<T | undefined>;
  clear(): Promise<void>;
}
