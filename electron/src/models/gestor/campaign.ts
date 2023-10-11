export interface CampaignDto {
  id: number;
  name: string;
  category_id: number;
  banner_locale_id: number;
  url_image: string;
  s3_key: string;
  expirated_at: string;
  max_points: number;
  average_ticket: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  actived: boolean;
  campaigns_reward: CampaignReward[];
}

export interface CampaignReward {
  id: number;
  campaign_id: number;
  description: string;
  url_image: string;
  s3_key: string;
  points_reward: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  product_id: string;
  expirated_at: Date;
  observation?: string;
  actived: boolean;
}
