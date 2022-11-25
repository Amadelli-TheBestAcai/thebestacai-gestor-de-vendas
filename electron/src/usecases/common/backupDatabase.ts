import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from '../../repository/storageNames'
import { BaseRepository } from "../../repository/baseRepository";
import { StoreCashDto } from "../../models/gestor";
import fs from 'fs-extra'
import path from 'path'

class BackupDatabase implements IUseCaseFactory {
  async execute(): Promise<void> {
    try {
      const storages = Object.values(StorageNames);
      let payload = {}

      Promise.all(
        storages.map(async storage => {
          const repository = new BaseRepository(storage)
          payload[storage] = await repository.getAll()
        })
      )

      const storeCashRepository = new BaseRepository<StoreCashDto>(StorageNames.StoreCash)
      const storeCash = await storeCashRepository.getOne()

      const backupName = `${storeCash?.history_id}`

      const filePath = path.resolve(process.env.AppData as string, "GestorDatabaseBackups", backupName)

      await fs.outputFile(`${filePath}.json`, JSON.stringify(payload))
    } catch (error) {
      console.log({
        message: "Error to create a backup",
        error
      })
    }
  }
}

export const backupDatabase = new BackupDatabase();
