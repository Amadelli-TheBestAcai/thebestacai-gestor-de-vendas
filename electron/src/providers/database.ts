import storage, { LocalStorage } from "node-persist";
class Database {
  private _storage = storage;
  constructor() {
    this._storage
      .init({
        dir: `${process.env.AppData}/GestorDatabase`,
      })
      .then(() => console.log("Database Up"));
  }

  getConnection(): LocalStorage {
    return this._storage;
  }
}

export default new Database();
