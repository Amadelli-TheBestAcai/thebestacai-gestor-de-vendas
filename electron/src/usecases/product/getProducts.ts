import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import { ProductDto, StoreDto } from "../../models/gestor";
import odinApi from "../../providers/odinApi";

interface Request {
  local: false;
}

class GetProducts implements IUseCaseFactory {
  constructor(
    private productRepository = new BaseRepository<ProductDto>(
      StorageNames.Product
    ),
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store)
  ) {}

  async execute({ local }: Request): Promise<ProductDto[]> {
    const hasInternet = await checkInternet();
    if (hasInternet && !local) {
      const store = await this.storeRepository.getOne();
      const {
        data: { content },
      } = await odinApi.get(`products_store/store/${store?.company_id}`);
      await this.productRepository.clear();
      await this.productRepository.createMany(content);
      return content;
    } else {
      return await this.productRepository.getAll();
    }
  }
}

export const getProducts = new GetProducts();
