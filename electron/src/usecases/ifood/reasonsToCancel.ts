import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";

import ifoodApi from "../../providers/ifoodApi";

interface Request {
  orderId: string;
}

class ReasonsToCancel implements IUseCaseFactory {
  async execute({
    orderId,
  }: Request): Promise<{ cancelCodeId: string; description: string }[]> {
    const hasInternet = await checkInternet();
    if (hasInternet) {
      const { data } = await ifoodApi.get(
        `/order/v1.0/orders/${orderId}/cancellationReasons`
      );
      return data;
    }
    throw new Error("Falha ao estabelecer conexão com internet");
  }
}

export const reasonsToCancel = new ReasonsToCancel();
