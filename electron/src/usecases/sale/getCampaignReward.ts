import { IUseCaseFactory } from "../useCaseFactory.interface";
import thorApi from "../../providers/thorApi";

interface Request {
  cpf: string;
}

class GetCampaignReward implements IUseCaseFactory {
  async execute({ cpf }: Request): Promise<{
    points_customer: number;
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
    }[];
  }> {
    const {
      data: { content },
    } = await thorApi.get(`/campaign-reward/reward/${cpf}`);

    console.log(content);
    return content;
  }
}
export const getCampaignReward = new GetCampaignReward();
