import { ipcRenderer } from "electron";
import { AxiosRequestConfig } from "axios";
import * as sound from "sound-play";

import { useCaseFactory } from "../useCaseFactory";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { integrate } from "./integrate";

import { BaseRepository } from "../../repository/baseRepository";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import { IfoodDto } from "../../models/gestor/ifood";
import { SettingsDto } from "../../models/gestor/settings";

import { getMerchant } from "./getMerchant";
import { findOrCreate } from "./findOrCreate";
import { authentication } from "./authentication";

class Pooling implements IUseCaseFactory {
  constructor(
    private ifoodRepository = new BaseRepository<IfoodDto>(StorageNames.Ifood),
    private settingsRepository = new BaseRepository<SettingsDto>(
      StorageNames.Settings
    ),
    private integrateUseCase = integrate
  ) {}

  async execute(): Promise<{
    response: IfoodDto;
    has_error: boolean;
    error_message?: string;
  }> {
    let ifood = await findOrCreate.execute();

    if (ifood.is_opened) {
      const hasInternet = await checkInternet();
      if (hasInternet) {
        if (ifood.authorizationCode && ifood.authorizationCodeVerifier) {
          const { response, status } = await authentication.execute();

          if (!status) {
            return {
              response: response,
              has_error: true,
              error_message:
                "Erro ao realizar autenticação no ifood. Refaça o login na tela de delivery",
            };
          } else {
            ifood = response;
          }

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

          await getMerchant.execute();

          const concludedOrCanlledOrders = ifood.orders.filter(
            (_order) =>
              _order.fullCode === "CONCLUDED" || _order.fullCode === "CANCELLED"
          );
          if (concludedOrCanlledOrders.length) {
            await Promise.all(
              concludedOrCanlledOrders.map(async (concludedOrCanlledOrder) => {
                const { has_internal_error } =
                  await useCaseFactory.execute<void>(this.integrateUseCase, {
                    payload: concludedOrCanlledOrder,
                  });
                if (!has_internal_error) {
                  ifood.orders = ifood.orders.filter(
                    (_order) => _order.id !== concludedOrCanlledOrder.id
                  );
                }
              })
            );
          }

          ifood.updated_at = new Date();
          ifood.new_orders = ifood.orders.filter(
            (order) => order.fullCode === "PLACED"
          ).length;

          if (ifood.new_orders > 0) {
            const settings = await this.settingsRepository.getOne();
            if (settings?.ifood_sound_path) {
              try {
                sound.play(settings.ifood_sound_path);
              } catch (error) {
                console.log({
                  message: "Error to play ifood new order sound",
                  path: settings.ifood_sound_path,
                  error,
                });
              }
            }
          }

          await this.ifoodRepository.update(ifood.id, ifood);
          return {
            response: ifood,
            has_error: false,
          };
        }
        return {
          response: ifood,
          has_error: false,
        };
      } else {
        return {
          response: ifood,
          has_error: true,
          error_message: "Aplicação sem conexão com internet",
        };
      }
    } else {
      return {
        response: ifood,
        has_error: false,
      };
    }
  }
}

export const pooling = new Pooling();
