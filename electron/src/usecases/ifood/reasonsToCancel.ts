import { ipcRenderer } from "electron";
import { AxiosRequestConfig } from "axios";
import { IUseCaseFactory } from "../useCaseFactory.interface";

import { checkInternet } from "../../providers/internetConnection";
import { authentication } from "./authentication";
interface Request {
  orderId: string;
}

class ReasonsToCancel implements IUseCaseFactory {
  async execute({
    orderId,
  }: Request): Promise<{ cancelCodeId: string; description: string }[]> {
    const hasInternet = await checkInternet();
    if (hasInternet) {
      const { response, status } = await authentication.execute();

      if (!status) {
        throw new Error(
          "Erro ao realizar autenticação no ifood. Refaça o login na tela de delivery"
        );
      }

      let reassons = await ipcRenderer.invoke("request-handler", {
        method: "GET",
        url: `https://merchant-api.ifood.com.br/order/v1.0/orders/${orderId}/cancellationReasons`,
        headers: { Authorization: `Bearer ${response.token}` },
      } as AxiosRequestConfig);
      reassons = JSON.parse(reassons);

      return reassons;
    }
    throw new Error("Falha ao estabelecer conexão com internet");
  }
}

export const reasonsToCancel = new ReasonsToCancel();
