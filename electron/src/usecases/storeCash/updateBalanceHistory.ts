import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { SaleDto, StoreCashDto } from "../../models/gestor";
import { getCurrentStoreCash } from "./getCurrentStoreCash";
import { useCaseFactory } from "../useCaseFactory";
import { getBalanceHistory } from '../../helpers/GetBalanceHistory'
import odinApi from '../../providers/odinApi'
import { Response } from "../../helpers/GetBalanceHistory";

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

  public async syncBalanceHistory(
    response: Response,
    balance_history: { id: number } & Partial<Response>
  ) {
    const divergents: Partial<Response> = {};

    for (const key in response) {
      const responseValue = response[key as keyof Response];
      const balanceValue = balance_history?.[key as keyof Response];

      if (responseValue !== balanceValue) {
        divergents[key as keyof Response] = responseValue;
      }
    }

    if (Object.keys(divergents).length > 0) {
      console.log("Campos divergentes:", divergents);
      console.log("Balance history recebido:", balance_history);

      await odinApi.put(
        `/balance_history/${balance_history.id}/update_only`,
        divergents
      );
    }
  }


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

    const { data: { data: balance_history } } = await odinApi.get(`/balance_history/${storeCash.history_id}`)

    if (balance_history) {
      await this.syncBalanceHistory(response, balance_history)
    }
  }
}

export const updateBalanceHistory = new UpdateBalanceHistory();
