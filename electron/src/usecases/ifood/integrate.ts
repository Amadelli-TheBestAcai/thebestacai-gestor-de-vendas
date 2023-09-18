import { IUseCaseFactory } from "../useCaseFactory.interface";
import { OrderDto, StoreCashDto } from "../../models/gestor";
import midasApi from "../../providers/midasApi";
import { StorageNames } from "../../repository/storageNames";
import { BaseRepository } from "../../repository/baseRepository";

class Integrate implements IUseCaseFactory {
  constructor(
    private storeCashRepository = new BaseRepository<StoreCashDto>(
      StorageNames.StoreCash
    )
  ) {}

  async execute({ payload }: { payload: OrderDto }): Promise<void> {
    const storeCash = await this.storeCashRepository.getOne();

    const data = {
      ifood_id: payload.id,
      company_id: storeCash?.store_id,
      cash_history_id: storeCash?.history_id,
      delivery: JSON.stringify(payload.delivery),
      orderType: payload.orderType,
      orderTiming: payload.orderTiming,
      displayId: payload.displayId,
      createdAt: payload.createdAt,
      preparationStartDateTime: payload.preparationStartDateTime,
      isTest: payload.isTest,
      merchant: JSON.stringify(payload.merchant),
      customer: JSON.stringify(payload.customer),
      items: JSON.stringify(payload.items),
      salesChannel: payload.salesChannel,
      total: JSON.stringify(payload.total),
      payments: JSON.stringify(payload.payments),
      fullCode: payload.fullCode,
      code: payload.code,
    };

    await midasApi.post("/ifood", data);
  }
}

export const integrate = new Integrate();
