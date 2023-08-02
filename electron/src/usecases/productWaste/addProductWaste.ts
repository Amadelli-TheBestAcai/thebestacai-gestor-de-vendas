import { useCaseFactory } from "../useCaseFactory";
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
      StorageNames.Product_Wast
    ),
    private integrateProductWasteUseCase = integrateProductWaste
  ) {}

  async execute({ payload }: Request): Promise<void> {
    await this.productWasteRepository.create({
      id: v4(),
      ...payload,
    });

    await useCaseFactory.execute<void>(this.integrateProductWasteUseCase);
  }
}

export const addProductWaste = new AddProductWaste();
