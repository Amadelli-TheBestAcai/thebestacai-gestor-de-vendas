import { ipcRenderer } from "electron";
import { AxiosRequestConfig } from "axios";

import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import { findOrCreate } from "./findOrCreate";

class GetMerchant implements IUseCaseFactory {
  constructor(
    private ifoodRepository = new BaseRepository<any>(StorageNames.Ifood)
  ) {}

  async execute(): Promise<void> {
    const hasInternet = await checkInternet();
    const ifood = await findOrCreate.execute();
    if (hasInternet && ifood.merchant_id) {
      let merchant = await ipcRenderer.invoke("request-handler", {
        method: "GET",
        url: `https://merchant-api.ifood.com.br/merchant/v1.0/merchants/${ifood.merchant_id}`,
        headers: { Authorization: `Bearer ${ifood.token}` },
      } as AxiosRequestConfig);
      merchant = JSON.parse(merchant);

      let status = await ipcRenderer.invoke("request-handler", {
        method: "GET",
        url: `https://merchant-api.ifood.com.br/merchant/v1.0/merchants//${ifood.merchant_id}/status`,
        headers: { Authorization: `Bearer ${ifood.token}` },
      } as AxiosRequestConfig);
      status = JSON.parse(status);

      merchant.status = status;

      await this.ifoodRepository.update(ifood.id, { merchant });
    }
  }
}

export const getMerchant = new GetMerchant();
