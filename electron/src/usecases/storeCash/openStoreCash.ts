import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import {
  StoreDto,
  SaleDto,
  StoreCashDto,
  OldCashHistoryDto,
} from "../../models/gestor";
import { backupDatabase } from "../common/backupDatabase";
import { v4 } from "uuid";

interface Request {
  amount_on_open: number;
}

class OpenStoreCash implements IUseCaseFactory {
  constructor(
    private storeCashRepository = new BaseRepository<StoreCashDto>(
      StorageNames.StoreCash
    ),
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store),
    private saleRepository = new BaseRepository<SaleDto>(StorageNames.Sale),
    private integratedSaleRepository = new BaseRepository<SaleDto>(
      StorageNames.Integrated_Sale
    ),
    private integratedHandlerRepository = new BaseRepository<SaleDto>(
      StorageNames.Integrated_Handler
    ),
    private oldCashHistoryRepository = new BaseRepository<OldCashHistoryDto>(
      StorageNames.Old_Cash_History
    )
  ) {}

  async execute({
    amount_on_open,
  }: Request): Promise<StoreCashDto | undefined> {
    const store = await this.storeRepository.getOne();

    const payload: StoreCashDto = {
      id: v4(),
      gv_sales: 0,
      code: "OFFLINE",
      amount_on_open,
      store_id: store?.id,
      is_opened: true,
      is_online: false,
    };

    backupDatabase.execute();

    await this.saleRepository.clear();
    await this.integratedSaleRepository.clear();
    await this.integratedHandlerRepository.clear();

    await this.storeCashRepository.clear();
    await this.storeCashRepository.create(payload);
    await this.oldCashHistoryRepository.clear();
    return payload;
  }
}

export const openStoreCash = new OpenStoreCash();
