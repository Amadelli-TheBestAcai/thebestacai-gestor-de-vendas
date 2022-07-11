import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import midasApi from "../../providers/midasApi";
import { checkInternet } from "../../providers/internetConnection";
import { BalanceDto, StoreCashDto, SaleDto } from "../../models/gestor";
import { getBalance } from "../../helpers/BalanceFormater";

interface Request {
  withClosedCash: false;
}

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
  async execute({ withClosedCash }: Request): Promise<BalanceDto | undefined> {
    const isConnected = await checkInternet();
    if (!isConnected) {
      return undefined;
    }

    const currentCash = await this.storeCashRepository.getOne();
    if (!currentCash) {
      return undefined;
    }

    if (!withClosedCash && !currentCash?.is_opened) {
      return undefined;
    }

    const notIntegratedSales = await this.notIntegratedSalesRepository.getAll()
    const integratedSales = await this.integratedSalesRepository.getAll()

    const balance = getBalance(
      [...notIntegratedSales, ...integratedSales]
        .filter(sale => !sale.deleted_at && (sale.cash_history_id === currentCash.history_id || !sale.is_online))
    );

    return balance;
  }
}

export const getStoreCashBalance = new GetStoreCashBalance();
