import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { StoreDto } from "../../models/gestor";
import axios from "axios";

class ConfigurationTEF implements IUseCaseFactory {
    constructor(
        private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store),
    ) { }

    async execute(): Promise<any> {
        const { data: data } = await axios.get(`http://localhost:7856/configura-cnpj`)
        console.log(data);
    }
}
export const configurationTEF = new ConfigurationTEF();
