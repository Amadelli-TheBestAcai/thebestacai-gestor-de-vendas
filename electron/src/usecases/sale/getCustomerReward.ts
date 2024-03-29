import { IUseCaseFactory } from "../useCaseFactory.interface";
import thorApi from "../../providers/thorApi";
import { ProductDto } from "../../models/gestor";
import { BaseRepository } from "../../repository/baseRepository";
import { StorageNames } from "../../repository/storageNames";

interface Request {
  hash_code: string;
}

class GetCustomerReward implements IUseCaseFactory {
  constructor(
    private productRepository = new BaseRepository<ProductDto>(
      StorageNames.Product
    )
  ) {}
  async execute({ hash_code }: Request): Promise<{
    name: string;
    points_customer: number;
    max_points: number;
    total_accumulated_points: number;
    customer_reward: {
      id: number;
      customer_id: number;
      customer_campaign_id: number;
      campaign_reward_id: number;
      created_at: string;
      updated_at: string;
      deleted_at: string;
      hash_code: string;
      taked_at: string;
      campaignReward: {
        id: number;
        campaign_id: number;
        customer_reward_id: number;
        description: string;
        url_image: string;
        s3_key: string;
        points_reward: number;
        created_at: string;
        updated_at: string;
        deleted_at: string;
        product_id: number;
        expirated_at: string;
        observation: string;
      };
    };
  }> {
    const {
      data: { content },
    } = await thorApi.get(
      `/customer-reward/find-reward?hash_code=${hash_code}`
    );

    const product = await this.productRepository.getOne({
      product_id: content.customer_reward.campaignReward.product_id,
    });

    if (!product) {
      throw new Error("Essa recompensa não foi cadastrada em sua loja!");
    }

    return content;
  }
}
export const getCustomerReward = new GetCustomerReward();
