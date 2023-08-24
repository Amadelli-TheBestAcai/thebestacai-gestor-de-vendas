import { IUseCaseFactory } from "../useCaseFactory.interface";
import thorApi from "../../providers/thorApi";

interface Request {
  phone: string;
  hash_code: string;
}

class GetCustomerReward implements IUseCaseFactory {
  async execute({ phone, hash_code }: Request): Promise<{
    name: string;
    points_customer: number;
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
			}
  }> {
    const {
      data: { content },
    } = await thorApi.get(`/customer-reward/find-reward/?cell_number=${phone}&hash_code=${hash_code}`);

    return content;
  }
}
export const getCustomerReward = new GetCustomerReward();
