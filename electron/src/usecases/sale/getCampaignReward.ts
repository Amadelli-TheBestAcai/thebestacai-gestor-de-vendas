import { IUseCaseFactory } from "../useCaseFactory.interface";
import thorApi from "../../providers/thorApi";

interface Request {
  cpf: string;
}

interface Reward {
  id: number;
  description: string;
  value: number;
  is_taked: boolean;
  refused: boolean;
}

class GetCampaignReward implements IUseCaseFactory {
  async execute({ cpf }: Request): Promise<Reward[]> {
    try {
      const {
        data: { content: rewards },
      } = await thorApi.get(`/campaign-reward/reward/${cpf}`);

      return rewards;
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  }
}

export const getCampaignReward = new GetCampaignReward();