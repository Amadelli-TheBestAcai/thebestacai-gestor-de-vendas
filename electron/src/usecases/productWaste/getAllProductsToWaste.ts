import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import { ProductDto, StoreDto } from "../../models/gestor";
import odinApi from "../../providers/odinApi";
import { clearDuplicatedValues } from "../../helpers/clearDuplicatedValues";

class GetAllProductsToWaste implements IUseCaseFactory {
  constructor(
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store),
    private productToWasteRepository = new BaseRepository<any>(
      StorageNames.Products_To_Waste
    )
  ) { }

  async execute(): Promise<ProductDto[]> {
    const hasInternet = await checkInternet();
    if (hasInternet) {
      const store = await this.storeRepository.getOne();
      const {
        data: { content },
      } = await odinApi.get(
        `/products_store/store/${store?.company_id}?stockProducts=true`
      );

      const {
        data: { data },
      } = await odinApi.get("/product_categories/products/storable");

      let response = content.map((storeProduct) => ({
        ...storeProduct.product,
        product_store_id: content.find(item => item.product_id === storeProduct.product.id).id
      }));

      data.map((category) => {
        const { products, ...categoryProps } = category;

        content.push(
          ...products.map((_product) => ({
            ..._product,
            category: categoryProps,
          }))
        );
      });

      response = clearDuplicatedValues(response, "id");

      await this.productToWasteRepository.createManyAndReplace(response);

      return response;
    } else {
      return await this.productToWasteRepository.getAll();
    }
  }
}

export const getAllProductsToWaste = new GetAllProductsToWaste();
