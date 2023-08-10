import { ipcRenderer } from "electron";
import { AxiosRequestConfig } from "axios";

import { IUseCaseFactory } from "../useCaseFactory.interface";
import { checkInternet } from "../../providers/internetConnection";

import ifoodApi from "../../providers/ifoodApi";
import { findOrCreate } from "./findOrCreate";
import { authentication } from "./authentication";

import { CatalogDto, CategoryDto } from "./dtos";

class GetCatalogs implements IUseCaseFactory {
  async execute(): Promise<CatalogDto[]> {
    const hasInternet = await checkInternet();
    if (hasInternet) {
      let ifood = await findOrCreate.execute();

      const { response, status } = await authentication.execute();
      if (!status) {
        throw new Error(
          "Erro ao realizar autenticação no ifood. Refaça o login na tela de delivery"
        );
      } else {
        ifood = response;
      }

      let catalogs = await ipcRenderer.invoke("request-handler", {
        method: "GET",
        url: `https://merchant-api.ifood.com.br/catalog/v2.0/merchants/${ifood.merchant_id}/catalogs`,
        headers: { Authorization: `Bearer ${ifood.token}` },
      } as AxiosRequestConfig);
      catalogs = JSON.parse(catalogs);

      await Promise.all(
        catalogs.map(async (catalog) => {
          let categories = await ipcRenderer.invoke("request-handler", {
            method: "GET",
            url: `https://merchant-api.ifood.com.br/catalog/v2.0/merchants/${ifood.merchant_id}/catalogs/${catalog.catalogId}/categories?includeItems=true`,
            headers: { Authorization: `Bearer ${ifood.token}` },
          } as AxiosRequestConfig);
          categories = JSON.parse(categories);

          catalog.categories = categories;
        })
      );

      return catalogs;
    }
    throw new Error("Falha ao estabelecer conexão com internet");
  }
}

export const getCatalogs = new GetCatalogs();
