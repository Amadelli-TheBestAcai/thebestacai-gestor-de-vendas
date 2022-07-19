import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { BalanceDto, StoreCashDto, SaleDto } from "../../models/gestor";
import { getBalance } from "../../helpers/BalanceFormater";

class GetStoreCashBalance implements IUseCaseFactory {
  constructor(
    private storeCashRepository = new BaseRepository<StoreCashDto>(
      StorageNames.StoreCash
    ),
    private notIntegratedSalesRepository = new BaseRepository<SaleDto>(
      StorageNames.Not_Integrated_Sale
    ),
    private integratedSalesRepository = new BaseRepository<SaleDto>(
      StorageNames.Integrated_Sale
    )
  ) { }
  async execute(): Promise<BalanceDto | undefined> {
    const currentCash = await this.storeCashRepository.getOne();
    if (!currentCash) {
      return undefined;
    }

    const notIntegratedSales = await this.notIntegratedSalesRepository.getAll()
    const integratedSales = await this.integratedSalesRepository.getAll()

    const balance = getBalance(
      [...notIntegratedSales, ...integratedSales]
        .filter(sale => !sale.deleted_at && (sale.cash_history_id === currentCash.history_id) && !sale.abstract_sale)
    );

    return balance;
  }
}

export const getStoreCashBalance = new GetStoreCashBalance();
