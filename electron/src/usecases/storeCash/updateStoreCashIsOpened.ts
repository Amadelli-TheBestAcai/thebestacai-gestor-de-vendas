import { IUseCaseFactory } from "../useCaseFactory.interface";
import { BaseRepository } from "../../repository/baseRepository";
import { StoreCashDto } from "../../models/gestor";
import { StorageNames } from "../../repository/storageNames";


class UpdateStoreCashIsOpened implements IUseCaseFactory {
    constructor(
        private storeCashRepository = new BaseRepository<StoreCashDto>(
            StorageNames.StoreCash)
    ) { }

    async execute(id: string): Promise<void> {
        console.log('aqui electron', id);

        const a = await this.storeCashRepository.getOne();
        console.log(a);
        await this.storeCashRepository.update(a?.id, { is_opened: false });
    }
}

export const updateStoreCashIsOpened = new UpdateStoreCashIsOpened();
