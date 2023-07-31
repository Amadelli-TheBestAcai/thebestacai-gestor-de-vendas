import { IUseCaseFactory } from "../useCaseFactory.interface";
import { BaseRepository } from "../../repository/baseRepository";
import { StorageNames } from "../../repository/storageNames";
import { ProductWasteDTO } from "../../models/gestor/productWaste";
import { v4 } from "uuid";

import { integrateProductWaste } from "./integrateProductWaste";

interface Request {
  payload: {
    cash_history_id: number;
    file: string;
    quantity: number;
    store_id: number;
    unity: number;
    product_id: number;
  };
}

class AddProductWaste implements IUseCaseFactory {
  constructor(
    private productWasteRepository = new BaseRepository<ProductWasteDTO>(
      StorageNames.PRODUCT_WAST
    ),
    private integrateProductWasteUseCase = integrateProductWaste
  ) {}

  async execute({ payload }: Request): Promise<void> {
    await this.productWasteRepository.create({
      id: v4(),
      ...payload,
    });

    await this.integrateProductWasteUseCase.execute();
  }
}

export const addProductWaste = new AddProductWaste();
