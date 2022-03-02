import Datastore from 'nedb-async'
class Database {
  private _storage: {
    key: string,
    dataStore: Datastore<any>
  }[] = [];

  getConnection<T>(key: string): Datastore<T> {
    const storage = this._storage.find(storage => storage.key === key);
    if (storage) {
      return storage.dataStore
    } else {
      const newStorage = {
        key,
        dataStore: new Datastore<T>({ filename: `${process.env.AppData}/GestorDatabase/${key}.db`, autoload: true })
      }
      this._storage.push(newStorage)
      return newStorage.dataStore
    }
  }
}

export default new Database();
