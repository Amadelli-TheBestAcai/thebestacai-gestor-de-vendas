import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { SaleDto } from "../../models/gestor";

class GetAllDelivery implements IUseCaseFactory {
  constructor(
    private deliveryRepository = new BaseRepository<SaleDto>(
      StorageNames.Delivery_Sale
    )
  ) {}

  async execute(): Promise<SaleDto[]> {
    return await this.deliveryRepository.getAll();
  }
}

export const getAllDelivery = new GetAllDelivery();
