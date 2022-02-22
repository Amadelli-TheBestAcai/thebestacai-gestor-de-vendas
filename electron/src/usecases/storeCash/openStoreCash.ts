import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import odinApi from "../../providers/odinApi";
import { checkInternet } from "../../providers/internetConnection";
import { StoreDto, StoreCashDto } from "../../models/gestor";
import { v4 } from "uuid";

interface Request {
  code: string;
  amount_on_open: number;
}

class OpenStoreCash implements IUseCaseFactory {
  constructor(
    private storeCashRepository = new BaseRepository<StoreCashDto>(
      StorageNames.StoreCash
    ),
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store)
  ) {}

  async execute({
    amount_on_open,
    code,
  }: Request): Promise<StoreCashDto | undefined> {
    const payload: StoreCashDto = {
      id: v4(),
      code,
      amount_on_open,
      is_opened: true,
      is_online: false,
    };
    const isConnected = await checkInternet();
    if (isConnected) {
      const currentStore = await this.storeRepository.getOne();
      const {
        data: {
          data: { cash_id, history_id, store_id },
        },
      } = await odinApi.put(
        `/store_cashes/${currentStore?.company_id}-${code}/open`,
        {
          amount_on_open: amount_on_open.toString() || "0",
        }
      );
      payload.cash_id = cash_id;
      payload.history_id = history_id;
      payload.store_id = store_id;
      payload.is_online = true;
    }
    await this.storeCashRepository.clear();
    await this.storeCashRepository.create(payload);
    return payload;
  }
}

export const openStoreCash = new OpenStoreCash();