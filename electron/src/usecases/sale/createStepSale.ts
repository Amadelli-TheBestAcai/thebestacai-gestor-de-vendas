import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { getCurrentSale, buildNewSale } from "./index";
import { SaleDto } from "../../models/gestor";

interface Request {
  name: string;
}

class CreateStepSale implements IUseCaseFactory {
  constructor(
    private saleRepository = new BaseRepository<SaleDto>(StorageNames.Sale),
    private stepSaleRepository = new BaseRepository<SaleDto>(
      StorageNames.Step_Sale
    ),
    private getCurrentSaleUseCase = getCurrentSale,
    private buildNewSaleUseCase = buildNewSale
  ) {}

  async execute({ name }: Request): Promise<SaleDto> {
    const { response: currentSale, has_internal_error: errorOnGetCurrentSale } =
      await useCaseFactory.execute<SaleDto>(this.getCurrentSaleUseCase);

    if (errorOnGetCurrentSale) {
      throw new Error("Erro ao obter venda atual");
    }
    if (!currentSale) {
      throw new Error("Nenhuma venda encontrada");
    }

    currentSale.name = name;
    currentSale.enabled = true;
    currentSale.is_current = false;

    await this.saleRepository.deleteById(currentSale.id);
    await this.stepSaleRepository.create(currentSale);

    const { response: newSale, has_internal_error: errorOnBuildNewSale } =
      await useCaseFactory.execute<SaleDto>(this.buildNewSaleUseCase);

    if (errorOnBuildNewSale) {
      throw new Error("Erro ao criar uma nova venda");
    }
    if (!newSale) {
      throw new Error("Nenhuma venda encontrada");
    }

    return newSale;
  }
}

export const createStepSale = new CreateStepSale();
