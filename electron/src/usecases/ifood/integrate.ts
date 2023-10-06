import { useCaseFactory } from "../useCaseFactory";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { OrderDto, StoreCashDto, SaleDto } from "../../models/gestor";
import midasApi from "../../providers/midasApi";
import { StorageNames } from "../../repository/storageNames";
import { BaseRepository } from "../../repository/baseRepository";

import { pooling } from "./pooling";
import { buildNewSale } from "../sale/buildNewSale";
import { onlineIntegration } from "../sale/onlineIntegration";
import { sleep } from "../../helpers/sleep";
class Integrate implements IUseCaseFactory {
  constructor(
    private storeCashRepository = new BaseRepository<StoreCashDto>(
      StorageNames.StoreCash
    ),
    private saleRepository = new BaseRepository<SaleDto>(
      StorageNames.Not_Integrated_Sale
    ),
    private onlineIntegrationUseCase = onlineIntegration
  ) {}

  async execute({ payload }: { payload: OrderDto }): Promise<void> {
    do {
      if (pooling.isRuning) {
        await sleep(1000);
        console.log("Waiting pooling to finish");
      }
    } while (pooling.isRuning);

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

    if (data.fullCode === "CONCLUDED") {
      let sale = await buildNewSale.execute({ withPersistence: false });

      sale.abstract_sale = false;
      sale.cash_history_id = storeCash?.history_id;
      sale.cash_id = storeCash?.cash_id;
      sale.discount = 0;
      sale.to_integrate = true;
      sale.is_integrated = false;
      sale.items = [];
      sale.quantity = payload.items.length;
      sale.ref = payload.id;
      sale.total_paid = payload.total.subTotal;
      sale.total_sold = payload.total.subTotal;
      sale.type = 1;
      sale.payments = payload.payments.methods.map((method, index) => ({
        id: (index + 1).toString(),
        amount: method.value,
        type: 4,
      }));

      await this.saleRepository.create(sale);
      await useCaseFactory.execute<void>(this.onlineIntegrationUseCase);
    }
  }
}

export const integrate = new Integrate();
