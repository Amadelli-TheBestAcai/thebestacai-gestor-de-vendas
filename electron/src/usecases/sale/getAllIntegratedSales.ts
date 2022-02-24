import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { SaleDto } from "../../models/gestor";

class GetAllIntegratedSales implements IUseCaseFactory {
  constructor(
    private integrateSaleRepository = new BaseRepository<SaleDto>(
      StorageNames.Integrated_Sale
    )
  ) {}

  async execute(): Promise<SaleDto[]> {
    return await this.integrateSaleRepository.getAll();
  }
}

export const getAllIntegratedSales = new GetAllIntegratedSales();
