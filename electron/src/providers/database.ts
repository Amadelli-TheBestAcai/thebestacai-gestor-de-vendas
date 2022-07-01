import Datastore from 'nedb-async'
import JSZip from 'jszip';

import { StorageNames } from '../repository/storageNames'
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

  async backup(): Promise<any> {
    const storages = Object.keys(StorageNames)

    const zip = new JSZip();

    await Promise.all(
      storages.map(async storage => {
        const content = await this.getConnection<any>(storage).asyncFind({})
        zip.file(`${storage}.json`, JSON.stringify(content));
      })
    )

    const dbBackup = await zip.generateAsync({ type: 'blob' })

    return dbBackup
  }
}

export default new Database();
