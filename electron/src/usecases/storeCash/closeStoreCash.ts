import { BaseRepository } from "../../repository/baseRepository";
import { useCaseFactory } from "../useCaseFactory";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import odinApi from "../../providers/odinApi";
import { checkInternet } from "../../providers/internetConnection";
import {
  StoreDto,
  StoreCashDto,
  OldCashHistoryDto,
  SaleDto,
} from "../../models/gestor";
import { updateBalanceHistory } from "./updateBalanceHistory";
import { integrateProductWaste } from "../productWaste/integrateProductWaste";

interface Request {
  code: string;
  amount_on_close: number;
}

class CloseStoreCash implements IUseCaseFactory {
  constructor(
    private stepSaleRepository = new BaseRepository<SaleDto>(
      StorageNames.Step_Sale
    ),
    private storeCashRepository = new BaseRepository<StoreCashDto>(
      StorageNames.StoreCash
    ),
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store),
    private oldCashHistoryRepository = new BaseRepository<OldCashHistoryDto>(
      StorageNames.Old_Cash_History
    ),
    private _updateBalanceHistory = updateBalanceHistory,
    private deliverySaleRepository = new BaseRepository<SaleDto>(
      StorageNames.Delivery_Sale
    ),
    private integrateProductWasteUseCase = integrateProductWaste
  ) {}

  async execute({
    amount_on_close,
    code,
  }: Request): Promise<StoreCashDto | undefined> {
    const isConnected = await checkInternet();
    if (isConnected) {
      let stepSales = (await this.stepSaleRepository.getAll()).filter(
        (sale) => sale.enabled
      );
      if (stepSales.length > 0) {
        throw new Error("Você ainda possui comandas pendentes");
      }
      const deliverySales = await this.deliverySaleRepository.getAll();
      if (deliverySales.length > 0) {
        throw new Error("Você ainda possui vendas pendentes no delivery");
      }
      const { has_internal_error: errorOnUpdateBalanceHistory } =
        await useCaseFactory.execute<StoreCashDto>(this._updateBalanceHistory);

      if (errorOnUpdateBalanceHistory) {
        throw new Error("Falha ao atualizar o histórico do caixa");
      }

      const currentStore = await this.storeRepository.getOne();

      await odinApi.put(
        `/store_cashes/${currentStore?.company_id}-${code}/close`,
        { amount_on_close: +amount_on_close?.toString() || 0 }
      );
    }
    const storeCash = await this.storeCashRepository.getOne();
    const updatedStoreCash = await this.storeCashRepository.update(
      storeCash?.id,
      {
        is_opened: false,
      }
    );

    const {
      data: { history },
    } = await odinApi.get(
      `/current_cash_history/${storeCash?.store_id}-${storeCash?.code}`
    );
    const oldCashHistory = await this.oldCashHistoryRepository.getOne();
    if (oldCashHistory) {
      await this.oldCashHistoryRepository.update(oldCashHistory.id, {
        ...history,
      });
    } else {
      await this.oldCashHistoryRepository.create({ ...history });
    }

    await useCaseFactory.execute<void>(this.integrateProductWasteUseCase);

    return updatedStoreCash;
  }
}

export const closeStoreCash = new CloseStoreCash();
