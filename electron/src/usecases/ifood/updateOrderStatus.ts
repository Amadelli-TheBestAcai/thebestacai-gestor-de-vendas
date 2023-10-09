import { ipcRenderer } from "electron";
import { BaseRepository } from "../../repository/baseRepository";
import { StorageNames } from "../../repository/storageNames";
import { AxiosRequestConfig } from "axios";

import { IUseCaseFactory } from "../useCaseFactory.interface";
import { checkInternet } from "../../providers/internetConnection";

import { getCatalogs } from "./getCatalogs";
import { authentication } from "./authentication";
import { pooling } from "./pooling";
import { sleep } from "../../helpers/sleep";

import { IfoodDto } from "../../models/gestor";

interface Request {
  id: string;
  status:
    | "confirm"
    | "startPreparation"
    | "readyToPickup"
    | "acceptCancellation"
    | "denyCancellation"
    | "requestCancellation";
  reasson?: {
    reason: string;
    cancellationCode: string;
  };
}

/*
"fullCode":"PLACED","code":"PLC"
"fullCode":"CONFIRMED","code":"CFM"
"fullCode":"READY_TO_PICKUP","code":"RTP"
"fullCode":"DISPATCHED","code":"DSP"
"fullCode":"CONCLUDED","code":"CON"
"fullCode":"CANCELLED","code":"CAN"
*/

const getStatusCode = (code: string): { fullCode: string; code: string } => {
  if (code === "confirm") {
    return {
      fullCode: "CONFIRMED",
      code: "CFM",
    };
  } else if (code === "readyToPickup") {
    return {
      fullCode: "READY_TO_PICKUP",
      code: "RTP",
    };
  } else if (code === "dispatch") {
    return {
      fullCode: "DISPATCHED",
      code: "DSP",
    };
  } else {
    return {
      fullCode: "CANCELLED",
      code: "CAN",
    };
  }
};

class UpdateOrderStatus implements IUseCaseFactory {
  constructor(
    private ifoodRepository = new BaseRepository<IfoodDto>(StorageNames.Ifood)
  ) {}

  async execute({ id, status, reasson }: Request): Promise<void> {
    do {
      if (pooling.isRuning) {
        await sleep(1000);
        console.log("Waiting pooling to finish");
      }
    } while (pooling.isRuning);
    const hasInternet = await checkInternet();
    if (hasInternet) {
      const { response, status: status_auth } = await authentication.execute();

      if (!status_auth) {
        throw new Error(
          "Erro ao realizar autenticação no ifood. Refaça o login na tela de delivery"
        );
      }

      await ipcRenderer.invoke("request-handler", {
        method: "POST",
        url: `https://merchant-api.ifood.com.br/order/v1.0/orders/${id}/${status}`,
        data: reasson,
        headers: { Authorization: `Bearer ${response.token}` },
      } as AxiosRequestConfig);

      const ifood = (await this.ifoodRepository.getOne()) as IfoodDto;
      const orderIndex = ifood?.orders.findIndex(
        (order) => order.id === id
      ) as number;
      if (orderIndex >= 0) {
        ifood.orders[orderIndex].code = getStatusCode(
          status.toLowerCase()
        ).code;
        ifood.orders[orderIndex].fullCode = getStatusCode(
          status.toLowerCase()
        ).fullCode;
        await this.ifoodRepository.update(ifood.id, ifood);
      }
    }

    throw new Error("Falha ao estabelecer conexão com internet");
  }
}

export const updateOrderStatus = new UpdateOrderStatus();
