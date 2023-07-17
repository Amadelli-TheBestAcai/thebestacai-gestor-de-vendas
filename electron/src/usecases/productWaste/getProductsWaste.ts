import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import odinApi from "../../providers/odinApi";
import { ProductDto, StoreDto } from "../../models/gestor";

interface Request {
  initialDate: string;
  finalDate: string;
}

export class GetWasteProduct implements IUseCaseFactory {
  constructor(
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store)
  ) {}

  async execute({ initialDate, finalDate }: Request): Promise<ProductDto[]> {
    const hasInternet = await checkInternet();
    if (hasInternet) {
      const store = await this.storeRepository.getOne();
      const {
        data: { data },
      } = await odinApi.get(
        `/products/waste/${store?.company_id}?dataInicial=${initialDate}&dataFinal=${finalDate}`
      );
      const wasteProducts = data;
      return wasteProducts;
    } else {
      return [];
    }
  }
}

export const getAllWasteProduct = new GetWasteProduct();
