import { ipcRenderer } from "electron";
import { AxiosRequestConfig } from "axios";

import { IUseCaseFactory } from "../useCaseFactory.interface";
import { checkInternet } from "../../providers/internetConnection";

import { getCatalogs } from "./getCatalogs";

import { CatalogDto } from "./dtos";
import { authentication } from "./authentication";

interface Request {
  status: "AVAILABLE" | "UNAVAILABLE";
  catalog_id: string;
  category_id: string;
  product_id: string;
  option_id: string;
}

class UpdateProductStatus implements IUseCaseFactory {
  async execute({
    status,
    category_id,
    product_id,
    catalog_id,
    option_id,
  }: Request): Promise<CatalogDto[]> {
    const hasInternet = await checkInternet();
    if (hasInternet) {
      const { response: ifood, status: status_on_auth } =
        await authentication.execute();
      if (!status_on_auth) {
        throw new Error(
          "Erro ao realizar autenticação no ifood. Refaça o login na tela de delivery"
        );
      }

      let url = "";

      if (option_id) {
        url = `https://merchant-api.ifood.com.br/catalog/v1.0/merchants/${ifood.merchant_id}/optionGroups/${option_id}/products/${product_id}/option?catalog_id=${catalog_id}`;
      } else if (product_id) {
        url = `https://merchant-api.ifood.com.br/catalog/v1.0/merchants/${ifood.merchant_id}/categories/${category_id}/products/${product_id}?catalog_id=${catalog_id}`;
      } else {
        url = `https://merchant-api.ifood.com.br/catalog/v1.0/merchants/${ifood.merchant_id}/catalogs/${catalog_id}/categories/${category_id}?catalog_id=${catalog_id}`;
      }

      await ipcRenderer.invoke("request-handler", {
        method: "PATCH",
        url,
        data: { status },
        headers: { Authorization: `Bearer ${ifood.token}` },
      } as AxiosRequestConfig);

      return await getCatalogs.execute();
    }

    throw new Error("Falha ao estabelecer conexão com internet");
  }
}

export const updateProductStatus = new UpdateProductStatus();
