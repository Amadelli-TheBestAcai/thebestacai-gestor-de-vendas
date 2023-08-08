import { IUseCaseFactory } from "../useCaseFactory.interface";
import { checkInternet } from "../../providers/internetConnection";

import ifoodApi from "../../providers/ifoodApi";
import { getCatalogs } from "./getCatalogs";

import { formUrlEncoded } from "../../helpers/formUrlEncoded";
import { CatalogDto } from "./dtos";

interface Request {
  id: string;
  status:
    | "confirm"
    | "startPreparation"
    | "readyToPickup"
    | "acceptCancellation"
    | "denyCancellation"
    | "requestCancellation";
  reasson?: {
    reason: string;
    cancellationCode: string;
  };
}

class UpdateOrderStatus implements IUseCaseFactory {
  async execute({ id, status, reasson }: Request): Promise<CatalogDto[]> {
    const hasInternet = await checkInternet();
    if (hasInternet) {
      await ifoodApi.post(`/orders/${id}/${status}`, formUrlEncoded(reasson));

      return await getCatalogs.execute();
    }

    throw new Error("Falha ao estabelecer conexão com internet");
  }
}

export const updateOrderStatus = new UpdateOrderStatus();
