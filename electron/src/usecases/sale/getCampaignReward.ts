import { IUseCaseFactory } from "../useCaseFactory.interface";
import thorApi from "../../providers/thorApi";
import moment from "moment";

interface Request {
  cpf: string;
}

class GetCampaignReward implements IUseCaseFactory {
  async execute({ cpf }: Request): Promise<
    {
      id: number;
      description: string;
      value: number;
      is_taked: boolean;
    }[]
  > {
    const {
      data: { content },
    } = await thorApi.get(`/customer-reward/${cpf}`);

    const campaigns = content.sort((a, b) => b.id - a.id);

    if (!campaigns.length) {
      throw new Error("Nenhuma campanha encontrada para este usuário");
    }

    const lastCampaign = campaigns[0];

    if (moment(lastCampaign?.campaign?.expirated_at).isBefore(new Date())) {
      throw new Error(
        "A última campanha que o usuário participou já esta expirada"
      );
    }

    if (!lastCampaign.customerReward.length) {
      throw new Error("Nenhuma recompensa encontrada para este usuário");
    }

    const response = lastCampaign.customerReward.map((customerReward) => {
      let value = 0;
      const content =
        customerReward.campaignReward.description.match(/R\$(\d+(,\d{2})?)/);
      if (content && content.length && content.length >= 1) {
        value = +content[1]?.replace(",", ".");
      }

      return {
        id: customerReward.id,
        description: customerReward.campaignReward.description,
        value: value,
        is_taked: customerReward.is_taked,
      };
    });

    return response;
  }
}

export const getCampaignReward = new GetCampaignReward();
