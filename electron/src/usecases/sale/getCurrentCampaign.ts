import { IUseCaseFactory } from "../useCaseFactory.interface";
import { CampaignDto } from "../../models/gestor";

import thorApi from "../../providers/thorApi";

class GetCurrentCampaign implements IUseCaseFactory {
  async execute(): Promise<CampaignDto> {
    const {
      data: { content },
    } = await thorApi.get("/campaign/last-campaign");
    return content;
  }
}

export const getCurrentCampaign = new GetCurrentCampaign();
