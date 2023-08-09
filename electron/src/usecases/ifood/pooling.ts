import { ipcRenderer } from "electron";
import { AxiosRequestConfig } from "axios";

import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import { IfoodDto } from "../../models/gestor/ifood";

import { getMerchant } from "./getMerchant";
import { findOrCreate } from "./findOrCreate";
import { authentication } from "./authentication";

class Pooling implements IUseCaseFactory {
  constructor(
    private ifoodRepository = new BaseRepository<IfoodDto>(StorageNames.Ifood)
  ) {}

  async execute(): Promise<IfoodDto | null> {
    let ifood = await findOrCreate.execute();

    if (ifood.is_opened) {
      const hasInternet = await checkInternet();
      if (hasInternet) {
        if (ifood.authorizationCode && ifood.authorizationCodeVerifier) {
          await getMerchant.execute();
          ifood = await authentication.execute();

          let newOrders = await ipcRenderer.invoke("request-handler", {
            method: "GET",
            url: `https://merchant-api.ifood.com.br/order/v1.0/events:polling?types=PLC,REC,CFM&groups=ORDER_STATUS,DELIVERY`,
            headers: { Authorization: `Bearer ${ifood.token}` },
          } as AxiosRequestConfig);
          newOrders = JSON.parse(newOrders);

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
                  let order = await ipcRenderer.invoke("request-handler", {
                    method: "GET",
                    url: `https://merchant-api.ifood.com.br/order/v1.0/orders/${newOrder.orderId}`,
                    headers: { Authorization: `Bearer ${ifood.token}` },
                  } as AxiosRequestConfig);
                  order = JSON.parse(order);

                  ifood.orders.push({
                    ...order,
                    fullCode: newOrder.fullCode,
                    code: newOrder.code,
                    createdAt: newOrder.createdAt,
                  });
                }
              })
            );

            await ipcRenderer.invoke("request-handler", {
              method: "POST",
              url: `https://merchant-api.ifood.com.br/order/v1.0/events/acknowledgment`,
              data: newOrders.map((newOrder) => ({ id: newOrder.id })),
              headers: { Authorization: `Bearer ${ifood.token}` },
            } as AxiosRequestConfig);
          }

          await this.ifoodRepository.update(ifood.id, ifood);
          return ifood;
        }
        return ifood;
      } else {
        throw new Error("Aplicação sem conexão com internet");
      }
    } else {
      return null;
    }
  }
}

export const pooling = new Pooling();
