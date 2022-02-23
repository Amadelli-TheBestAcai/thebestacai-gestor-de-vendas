import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { buildNewSale } from "./buildNewSale";
import { SaleDto } from "../../models/gestor";

class GetCurrentSale implements IUseCaseFactory {
  constructor(
    private saleRepository = new BaseRepository<SaleDto>(StorageNames.Sale),
    private buildNewSaleUseCase = buildNewSale
  ) {}

  async execute(): Promise<SaleDto | undefined> {
    const sales = await this.saleRepository.getAll();
    const currentSale = sales.find((_sale) => _sale.is_current);
    if (currentSale) {
      return currentSale;
    } else {
      const { response: newSale, has_internal_error: errorOnBuildNewSale } =
        await useCaseFactory.execute<SaleDto>(this.buildNewSaleUseCase);
      if (errorOnBuildNewSale) {
        throw new Error("Erro ao criar uma nova venda");
      }
      return newSale;
    }
  }
}

export const getCurrentSale = new GetCurrentSale();
