import { IUseCaseFactory } from "../useCaseFactory.interface";
import odinApi from "../../providers/odinApi";
import { StoreCashDto } from "../../models/gestor";
import { StoreCashHistoryDTO } from "../../models/dtos/storeCashHistory";
import { getCurrentStoreCash } from "./getCurrentStoreCash";
import { useCaseFactory } from "../useCaseFactory";

class GetStoreCashHistory implements IUseCaseFactory {
  constructor(private getCurrentStoreCashUseCase = getCurrentStoreCash) {}

  async execute(): Promise<StoreCashHistoryDTO | undefined> {
    const { response: cashier, has_internal_error: errorOnStoreCash } =
      await useCaseFactory.execute<StoreCashDto | undefined>(
        this.getCurrentStoreCashUseCase
      );

    if (errorOnStoreCash) {
      throw new Error("Falha ao obter caixa atual");
    }

    if (cashier && cashier.history_id) {
      const { code, store_id } = cashier;
      const {
        data: { history },
      } = await odinApi.get(`/current_cash_history/${store_id}-${code}`);
      return history;
    } else {
      return undefined;
    }
  }
}

export const getStoreCashHistory = new GetStoreCashHistory();
