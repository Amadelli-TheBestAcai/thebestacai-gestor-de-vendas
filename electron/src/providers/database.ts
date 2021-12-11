import storage, { LocalStorage } from "node-persist";

class Database {
  async init() {
    await storage.init({
      dir: `${process.env.AppData}/GestorDatabase`,
    });
    await storage.setItem("key", "key");
    console.log("Database Up");
  }

  getConnection(): LocalStorage {
    return storage;
  }
}

export default new Database();
