export interface CustomerReward{
    points_customer: number;
    customer_name: string;
    customer_id: number;
    customer_campaign_id: number;
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
}