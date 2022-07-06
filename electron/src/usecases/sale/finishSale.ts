import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { SaleDto } from "../../models/gestor";

interface Request {
  payload: SaleDto;
  fromDelivery?: boolean;
}

class FinishSale implements IUseCaseFactory {
  constructor(
    private saleRepository = new BaseRepository<SaleDto>(StorageNames.Sale),
    private deliverySaleRepository = new BaseRepository<SaleDto>(
      StorageNames.Delivery_Sale
    ),
    private notIntegratedSaleRepository = new BaseRepository<SaleDto>(
      StorageNames.Not_Integrated_Sale
    )
  ) { }

  async execute({ payload, fromDelivery }: Request): Promise<void> {
    payload.is_current = false;
    payload.to_integrate = true;

    if (fromDelivery) {
      await this.deliverySaleRepository.deleteById(payload.id);
    } else {
      await this.saleRepository.deleteById(payload.id);
    }

    payload.abstract_sale = false
    await this.notIntegratedSaleRepository.create(payload);


  }
}

export const finishSale = new FinishSale();
