import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import { ProductDto, StoreDto } from "../../models/gestor";
import odinApi from "../../providers/odinApi";

class GetAllProductStore implements IUseCaseFactory {
  constructor(
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store)
  ) {}

  async execute(): Promise<ProductDto[]> {
    const hasInternet = await checkInternet();
    if (hasInternet) {
      const store = await this.storeRepository.getOne();
      const {
        data: { content },
      } = await odinApi.get(
        `/products_store/store/${store?.company_id}?stockProducts=true`
      );
      return content;
    } else {
      return [];
    }
  }
}

export const getAllProductStore = new GetAllProductStore();
