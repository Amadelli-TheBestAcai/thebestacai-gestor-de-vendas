import { IUseCaseFactory } from "../useCaseFactory.interface";
import odinApi from "../../providers/odinApi";
import { StoreCashDto } from "../../models/gestor";
import { StoreCashHistoryDTO } from "../../models/dtos/storeCashHistory";
import { getCurrentStoreCash } from "./getCurrentStoreCash";
import { useCaseFactory } from "../useCaseFactory";

class GetStoreCashHistoryService implements IUseCaseFactory {
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
      if (!cashier) {
        throw new Error("Caixa não encontrado");
      }
      if (!cashier.history_id) {
        throw new Error("Historico do caixa não encontrado");
      }
      return undefined;
    }
  }
}

export const getStoreCashHistoryService = new GetStoreCashHistoryService();
