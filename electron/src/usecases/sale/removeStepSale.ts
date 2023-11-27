import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { SaleDto } from "../../models/gestor";

interface Request {
  id: string | number;
}

class RemoveStepSale implements IUseCaseFactory {
  constructor(
    private saleStepRepository = new BaseRepository<SaleDto>(
      StorageNames.Step_Sale
    )
  ) {}

  async execute({ id }: Request): Promise<void> {
    await this.saleStepRepository.deleteById(id);
  }
}

export const removeStepSale = new RemoveStepSale();
