import { BaseRepository } from "../repository/baseRepository";

export type Entity = {
  id?: string;
  context: string;
  error: string;
};

class Log extends BaseRepository<Entity> {
  constructor(storageName = "Log") {
    super(storageName);
  }
}

export default new Log();
