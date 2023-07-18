import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { ProductDto } from "../../models/gestor";

interface Request {
    id: number;
}

class GetIdProducts implements IUseCaseFactory {
    constructor(
        private productRepository = new BaseRepository<ProductDto>(
            StorageNames.Product
        ),
    ) { }

    async execute({ id }: Request): Promise<ProductDto | undefined> {
        return await this.productRepository.getOne({ product_id: id });
    }
}

export const getIdProducts = new GetIdProducts();
