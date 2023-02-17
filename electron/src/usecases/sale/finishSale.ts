import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { SaleDto, StoreCashDto } from "../../models/gestor";
import { onlineIntegration } from "./onlineIntegration";

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
    private storeCashRepository = new BaseRepository<StoreCashDto>(
      StorageNames.StoreCash
    ),
    private notIntegratedSaleRepository = new BaseRepository<SaleDto>(
      StorageNames.Not_Integrated_Sale
    ),
    private onlineIntegrationUseCase = onlineIntegration
  ) { }

  async execute({ payload, fromDelivery }: Request): Promise<void> {
    payload.is_current = false;
    payload.to_integrate = true;

    if (fromDelivery) {
      await this.deliverySaleRepository.deleteById(payload.id);
    } else {
      await this.saleRepository.deleteById(payload.id);
    }

    payload.abstract_sale = false;

    const storeCash = await this.storeCashRepository.getOne() as StoreCashDto;
    const newGvId = (storeCash?.gv_sales || 0) + 1;
    storeCash.gv_sales = newGvId;

    await this.storeCashRepository.update(storeCash.id, storeCash);
    await this.notIntegratedSaleRepository.create({ ...payload, gv_id: newGvId });

    const { has_internal_error: errorOnOnlineTntegrate, response, error_message } =
      await useCaseFactory.execute<void>(this.onlineIntegrationUseCase);

    if (errorOnOnlineTntegrate) {
      if (error_message === "Network Error") {
        throw new Error("O sistema está offline");
      }
      throw new Error(error_message || "Erro ao integrar venda online");
    } else {
      return response;
    }
  }
}

export const finishSale = new FinishSale();
