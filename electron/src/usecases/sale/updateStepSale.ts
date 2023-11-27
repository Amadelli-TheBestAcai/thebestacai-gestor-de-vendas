import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { SaleDto } from "../../models/gestor";

interface Request {
  id: string | number;
  payload: SaleDto;
}

class UpdateStepSale implements IUseCaseFactory {
  constructor(
    private saleStepRepository = new BaseRepository<SaleDto>(
      StorageNames.Step_Sale
    )
  ) {}

  async execute({ id, payload }: Request): Promise<SaleDto> {
    const sale = await this.saleStepRepository.update(id, payload);
    if (!sale) {
      throw new Error("Erro ao atualizar a comanda");
    }
    return sale;
  }
}

export const updateStepSale = new UpdateStepSale();
