import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { ProductDto } from "../../models/gestor";

class GetSelfService implements IUseCaseFactory {
  constructor(
    private productRepository = new BaseRepository<ProductDto>(
      StorageNames.Product
    )
  ) {}

  async execute(): Promise<ProductDto | undefined> {
    const products = await this.productRepository.getAll();
    return products.find((_product) => _product.product.category_id === 1);
  }
}

export const getSelfService = new GetSelfService();
