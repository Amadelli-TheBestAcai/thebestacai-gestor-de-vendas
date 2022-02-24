import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { onlineIntegration } from "./onlineIntegration";
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
    private onlineIntegrationUseCase = onlineIntegration
  ) {}

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
    await this.notIntegratedSaleRepository.createMany(deliveryToIntegrate);

    const { has_internal_error: errorOnOnlineTntegrate, response } =
      await useCaseFactory.execute<void>(this.onlineIntegrationUseCase);

    if (errorOnOnlineTntegrate) {
      throw new Error("Erro ao integrar venda online");
    } else {
      return response;
    }
  }
}

export const integrateAllSalesFromType = new IntegrateAllSalesFromType();
