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
      ifood = await authentication.execute();
      let { data: catalogs } = await ifoodApi.get<CatalogDto[]>(
        `/catalog/v2.0/merchants/${ifood.merchant_id}`
      );

      await Promise.all(
        catalogs.map(async (catalog) => {
          const { data: categories } = await ifoodApi.get<CategoryDto[]>(
            `/catalog/v2.0/merchants/${ifood.merchant}/catalogs/${catalog.groupId}/categories?includeItems=true`
          );

          catalog.categories = categories;
        })
      );

      return catalogs;
    }
    throw new Error("Falha ao estabelecer conexão com internet");
  }
}

export const getCatalogs = new GetCatalogs();
