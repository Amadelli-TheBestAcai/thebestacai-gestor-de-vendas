import thorApi from "../../providers/thorApi";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { checkInternet } from "../../providers/internetConnection";
import { ProductDto } from "../../models/gestor";
import { BaseRepository } from "../../repository/baseRepository";
import { StorageNames } from "../../repository/storageNames";

interface Request {
  payload;
}

class CreateCustomerReward implements IUseCaseFactory {
  private productRepository = new BaseRepository<ProductDto>(
    StorageNames.Product
  );

  async execute({ payload }: Request): Promise<void> {
    await Promise.all(
      payload.customer_reward.map(async (item) => {
        const product = await this.productRepository.getOne({
          product_id: item.product_id,
        });
        if (!product) {
          throw new Error("Essa recompensa não foi cadastrada em sua loja!");
        }
      })
    );

    const hasInternet = await checkInternet();
    if (hasInternet) {
      await thorApi.post(`/customer-reward/accept-reward`, payload);
    }
  }
}

export const createCustomerReward = new CreateCustomerReward();
