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

  async execute({ id, payload }: Request): Promise<SaleDto | undefined> {
    return await this.saleRepository.update(id, payload);
  }
}

export const updateSale = new UpdateSale();
