import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { SalesTypes } from "../../models/enums/salesTypes";
import { finishSale } from "./finishSale";
import { SaleDto } from "../../models/gestor";

interface Request {
  type: number;
}

class IntegrateAllSalesFromType implements IUseCaseFactory {
  constructor(
    private deliverySaleRepository = new BaseRepository<SaleDto>(
      StorageNames.Delivery_Sale
    ),
    private notIntegratedSaleRepository = new BaseRepository<SaleDto>(
      StorageNames.Not_Integrated_Sale
    ),
    private finishSaleUseCase = finishSale
  ) { }

  async execute({ type }: Request): Promise<void> {
    const deliverySales = await this.deliverySaleRepository.getAll();

    const deliveryNotToIntegrate = deliverySales.filter(
      (_deliverySale) => _deliverySale.type !== type
    );

    await this.deliverySaleRepository.createManyAndReplace(
      deliveryNotToIntegrate
    );

    const deliveryToIntegrate = deliverySales.filter(
      (_deliverySale) => _deliverySale.type === type
    );

    await Promise.all(
      deliveryToIntegrate.map(async payload => {
        const { has_internal_error: errorOnOnlineTntegrate, response } =
          await useCaseFactory.execute<void>(this.finishSaleUseCase,
            {
              payload: {
                ...payload,
                formated_type: SalesTypes[payload.type]
              }, fromDelivery: true
            });
        if (errorOnOnlineTntegrate) {
          throw new Error("Erro ao integrar venda online");
        } else {
          return response;
        }

      })
    )
  }
}

export const integrateAllSalesFromType = new IntegrateAllSalesFromType();
