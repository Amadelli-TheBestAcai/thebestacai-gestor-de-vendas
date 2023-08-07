import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import { IfoodDto } from "../../models/gestor/ifood";

import ifoodApi from "../../providers/ifoodApi";

import { getMerchant } from "./getMerchant";
import { findOrCreate } from "./findOrCreate";
import { authentication } from "./authentication";

class Pooling implements IUseCaseFactory {
  constructor(
    private ifoodRepository = new BaseRepository<IfoodDto>(StorageNames.Ifood)
  ) {}

  async execute(): Promise<IfoodDto> {
    const hasInternet = await checkInternet();
    if (hasInternet) {
      await getMerchant.execute();
      let ifood = await findOrCreate.execute();
      if (ifood.authorizationCode && ifood.authorizationCodeVerifier) {
        ifood = await authentication.execute();

        const { data: newOrders } = await ifoodApi.get(
          "/order/v1.0/events:polling?types=PLC,REC,CFM&groups=ORDER_STATUS,DELIVERY"
        );

        if (newOrders && newOrders.length) {
          await Promise.all(
            newOrders.map(async (newOrder) => {
              const orderIndex = ifood.orders.findIndex(
                (_order) => _order.id === newOrder.orderId
              );

              if (orderIndex >= 0) {
                ifood.orders[orderIndex] = {
                  ...ifood.orders[orderIndex],
                  fullCode: newOrder.fullCode,
                  code: newOrder.code,
                  createdAt: newOrder.createdAt,
                };
              } else {
                const { data: order } = await ifoodApi.get(
                  `/order/v1.0/orders/${newOrder.orderId}`
                );

                ifood.orders.push({
                  ...order,
                  fullCode: newOrder.fullCode,
                  code: newOrder.code,
                  createdAt: newOrder.createdAt,
                });
              }
            })
          );

          await ifoodApi.post(
            "/order/v1.0/events/acknowledgment",
            newOrders.map((newOrder) => ({ id: newOrder.id }))
          );
        }

        await this.ifoodRepository.update(ifood.id, ifood);
        return ifood;
      }
      return ifood;
    } else {
      throw new Error("Aplicação sem conexão com internet");
    }
  }
}

export const pooling = new Pooling();
