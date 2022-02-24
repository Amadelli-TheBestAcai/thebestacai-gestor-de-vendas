import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { SaleDto } from "../../models/gestor";

interface Request {
  payload: any;
}

class CreateDelivery implements IUseCaseFactory {
  constructor(
    private deliveryRepository = new BaseRepository<SaleDto>(
      StorageNames.Delivery_Sale
    )
  ) {}

  async execute({ payload }: Request): Promise<void> {
    await this.deliveryRepository.create(payload);
  }
}

export const createDelivery = new CreateDelivery();
