import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { SaleDto } from "../../models/gestor";

interface Request {
  id: string | number;
  payload: SaleDto;
}

class UpdateSale implements IUseCaseFactory {
  constructor(
    private saleRepository = new BaseRepository<SaleDto>(StorageNames.Sale)
  ) {}

  async execute({ id, payload }: Request): Promise<SaleDto> {
    const sale = await this.saleRepository.update(id, payload);
    if (!sale) {
      throw new Error("Erro ao atualizar a venda");
    }
    return sale;
  }
}

export const updateSale = new UpdateSale();
