import { IUseCaseFactory } from "../useCaseFactory.interface";
import { checkInternet } from "../../providers/internetConnection";

import ifoodApi from "../../providers/ifoodApi";
import { findOrCreate } from "./findOrCreate";
import { getCatalogs } from "./getCatalogs";

import { formUrlEncoded } from "../../helpers/formUrlEncoded";
import { CatalogDto } from "./dtos";

interface Request {
  status: "AVAILABLE" | "UNAVAILABLE";
  category_id: string;
  product_id: string;
  catalog_id: string;
}

class UpdateProductStatus implements IUseCaseFactory {
  async execute({
    status,
    category_id,
    product_id,
    catalog_id,
  }: Request): Promise<CatalogDto[]> {
    const hasInternet = await checkInternet();
    if (hasInternet) {
      const ifood = await findOrCreate.execute();

      await ifoodApi.patch(
        `/catalog/v1.0/merchants/${ifood.merchant_id}/categories/${category_id}/products/${product_id}?catalogId=${catalog_id}`,
        formUrlEncoded({ status })
      );

      return await getCatalogs.execute();
    }

    throw new Error("Falha ao estabelecer conexão com internet");
  }
}

export const updateProductStatus = new UpdateProductStatus();
