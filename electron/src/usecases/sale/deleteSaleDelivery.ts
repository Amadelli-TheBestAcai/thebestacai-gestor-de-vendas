import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { SaleDto } from "../../models/gestor";

interface Request {
  id: any;
}

class DeleteSaleDelivery implements IUseCaseFactory {
  constructor(
    private deliveryRepository = new BaseRepository<SaleDto>(
      StorageNames.Delivery_Sale
    )
  ) {}

  async execute({ id }: Request): Promise<void> {
    await this.deliveryRepository.deleteById(id);
  }
}

export const deleteSaleDelivery = new DeleteSaleDelivery();
