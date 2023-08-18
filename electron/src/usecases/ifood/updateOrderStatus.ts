import { ipcRenderer } from "electron";
import { AxiosRequestConfig } from "axios";

import { IUseCaseFactory } from "../useCaseFactory.interface";
import { checkInternet } from "../../providers/internetConnection";

import ifoodApi from "../../providers/ifoodApi";
import { getCatalogs } from "./getCatalogs";
import { authentication } from "./authentication";

import { formUrlEncoded } from "../../helpers/formUrlEncoded";
import { CatalogDto } from "./dtos";

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

class UpdateOrderStatus implements IUseCaseFactory {
  async execute({ id, status, reasson }: Request): Promise<CatalogDto[]> {
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

      return await getCatalogs.execute();
    }

    throw new Error("Falha ao estabelecer conexão com internet");
  }
}

export const updateOrderStatus = new UpdateOrderStatus();
