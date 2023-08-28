export interface CustomerReward {
  id: number;
  points_customer: number;
  customer_name: string;
  customer_id: number;
  customer_campaign_id: number;
  campaign_reward_id: number; 
  created_at: string; 
  taked_at: string | null; 
  hash_code: string; 
  updated_at: string; 
}

export interface Reward {
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
  observation: string | null; 
}
