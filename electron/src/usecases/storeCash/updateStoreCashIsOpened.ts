import { IUseCaseFactory } from "../useCaseFactory.interface";
import { BaseRepository } from "../../repository/baseRepository";
import { StoreCashDto } from "../../models/gestor";
import { StorageNames } from "../../repository/storageNames";


class UpdateStoreCashIsOpened implements IUseCaseFactory {
    constructor(
        private storeCashRepository = new BaseRepository<StoreCashDto>(
            StorageNames.StoreCash)
    ) { }

    async execute(): Promise<void> {
        const storeCash = await this.storeCashRepository.getOne();
        await this.storeCashRepository.update(storeCash?.id, { is_opened: false, is_online: false });
    }
}

export const updateStoreCashIsOpened = new UpdateStoreCashIsOpened();
