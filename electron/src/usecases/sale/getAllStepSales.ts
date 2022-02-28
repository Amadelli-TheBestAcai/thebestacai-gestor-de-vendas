import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { SaleDto } from "../../models/gestor";

class GetAllStepSales implements IUseCaseFactory {
  constructor(
    private stepSaleRepository = new BaseRepository<SaleDto>(
      StorageNames.Step_Sale
    )
  ) {}

  async execute(): Promise<SaleDto[]> {
    return await this.stepSaleRepository.getAll();
  }
}

export const getAllStepSales = new GetAllStepSales();
