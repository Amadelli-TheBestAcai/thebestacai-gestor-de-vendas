import { IUseCaseFactory } from "../useCaseFactory.interface";
import { checkInternet } from "../../providers/internetConnection";
import thorApi from "../../providers/thorApi";

interface Request {
  payload: any;
}

class CreateCustomerReward implements IUseCaseFactory {
  async execute({ payload }: Request): Promise<void> {
    const hasInternet = await checkInternet();
    if (hasInternet) {
        await thorApi.post(`/customer-reward/accept-reward`, payload);
    }
  }
}

export const createCustomerReward = new CreateCustomerReward();
