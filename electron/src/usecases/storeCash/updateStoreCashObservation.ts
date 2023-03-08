import { IUseCaseFactory } from "../useCaseFactory.interface";
import odinApi from "../../providers/odinApi";
import { OldCashHistoryDto, StoreCashDto } from "../../models/gestor";
import { getCurrentStoreCash } from "./getCurrentStoreCash";
import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { StorageNames } from "../../repository/storageNames";

interface Request {
  observation: string;
}

class UpdateStoreCashObservation implements IUseCaseFactory {
  constructor(private getCurrentStoreCashUseCase = getCurrentStoreCash,
    private oldCashHistoryRepository = new BaseRepository<OldCashHistoryDto>(
      StorageNames.Old_Cash_History)
  ) { }

  async execute({ observation }: Request): Promise<void> {
    const { response: cashier, has_internal_error: errorOnStoreCash } =
      await useCaseFactory.execute<StoreCashDto | undefined>(
        this.getCurrentStoreCashUseCase
      );

    if (errorOnStoreCash) {
      throw new Error("Falha ao obter caixa atual");
    }
    if (!cashier) {
      throw new Error("Caixa não encontrado");
    }

    await odinApi.put(`/cash_history/${cashier?.history_id}`, {
      observation,
    });
    const oldCashHistory = await this.oldCashHistoryRepository.getOne();
    await this.oldCashHistoryRepository.update(oldCashHistory?.id, { observation });
  }
}

export const updateStoreCashObservation = new UpdateStoreCashObservation();
