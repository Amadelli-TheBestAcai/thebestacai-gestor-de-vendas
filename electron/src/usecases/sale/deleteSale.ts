import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { SaleDto } from "../../models/gestor";

interface Request {
    id: any;
}

class DeleteSale implements IUseCaseFactory {
    constructor(
        private saleRepository = new BaseRepository<SaleDto>(StorageNames.Sale),
    ) { }

    async execute({ id }: Request): Promise<void> {
        await this.saleRepository.deleteById(id);
    }
}

export const deleteSale = new DeleteSale();
