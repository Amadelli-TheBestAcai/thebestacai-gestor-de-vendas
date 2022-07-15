import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { SaleDto, StoreCashDto } from "../../models/gestor";
import { getCurrentStoreCash } from "./getCurrentStoreCash";
import { useCaseFactory } from "../useCaseFactory";
import { getBalanceHistory } from '../../helpers/GetBalanceHistory'
import odinApi from '../../providers/odinApi'

class UpdateBalanceHistory implements IUseCaseFactory {
  constructor(
    private integratedSaleRepository = new BaseRepository<SaleDto>(
      StorageNames.Integrated_Sale
    ),
    private notIntegratedSaleRepository = new BaseRepository<SaleDto>(
      StorageNames.Not_Integrated_Sale
    ),
    private getCurrentSaleUseCase = getCurrentStoreCash
  ) { }
  async execute(): Promise<void> {
    const { response: storeCash, has_internal_error: errorOnGetCurrentStoreCash } =
      await useCaseFactory.execute<StoreCashDto>(this.getCurrentSaleUseCase)

    if (errorOnGetCurrentStoreCash) {
      throw new Error("Erro ao obter caixa atual");
    }
    if (!storeCash || !storeCash.is_online || !storeCash.is_opened) {
      throw new Error("Nenhuma caixa online encontrado");
    }

    const notIntegratedSales = await this.notIntegratedSaleRepository.getAll({
      cash_history_id: storeCash.history_id
    })

    const integratedSales = await this.integratedSaleRepository.getAll({
      cash_history_id: storeCash.history_id
    })

    const sales = [
      ...notIntegratedSales,
      ...integratedSales
    ].filter(sale => !sale.deleted_at && (sale.cash_history_id === storeCash.history_id) && !sale.abstract_sale);

    const response = getBalanceHistory(sales)

    await odinApi.post('/balance_history', { ...response, cash_history_id: storeCash.history_id })
  }
}

export const updateBalanceHistory = new UpdateBalanceHistory();
