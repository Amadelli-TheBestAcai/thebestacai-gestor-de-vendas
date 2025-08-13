import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import { ProductDto, StoreDto } from "../../models/gestor";
import odinApi from "../../providers/odinApi";

interface Request {
  tags: string[];
}

class GetProductsByTags implements IUseCaseFactory {
  constructor(
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store)
  ) {}

  async execute({ tags }: Request): Promise<ProductDto[]> {
    const hasInternet = await checkInternet();
    if (hasInternet) {
      const store = await this.storeRepository.getOne();
      const { data } = await odinApi.get(
        `/products_store?store_id=${store?.company?.id}&tags=${tags.join(",")}`
      );
      return data;
    } else {
      throw new Error(
        "Conexão com internet indisponível para busca de produtos"
      );
    }
  }
}

export const getProductsByTags = new GetProductsByTags();
