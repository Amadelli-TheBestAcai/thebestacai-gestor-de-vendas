import { BaseRepository } from "../../repository/baseRepository";
import database from '../../providers/database';
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import odinApi from "../../providers/odinApi";
import { checkInternet } from "../../providers/internetConnection";
import { StoreDto, StoreCashDto } from "../../models/gestor";

class OpenOnlineStoreCash implements IUseCaseFactory {
  constructor(
    private storeCashRepository = new BaseRepository<StoreCashDto>(
      StorageNames.StoreCash
    ),
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store)
  ) { }

  async execute(): Promise<StoreCashDto | undefined> {
    const hasConnection = await checkInternet();
    if (!hasConnection) {
      return undefined;
    }

    const storeCash = await this.storeCashRepository.getOne() as StoreCashDto;
    const store = await this.storeRepository.getOne() as StoreDto;


    const {
      data: { data },
    } = await odinApi.get(
      `/store_cashes/${store?.company_id}/summary`
    );

    const { closed } = data;

    const cashes: string[] = closed.map((cash) => cash.split("-")[1]);

    if (!cashes.length) {
      throw new Error(`Nenhum caixa está disponível 
      para abertura, entre em contato com o suporte`);
    }

    const code = cashes[0];

    const {
      data: {
        data: { cash_id, history_id, store_id },
      },
    } = await odinApi.put(
      `/store_cashes/${store?.company_id}-${code}/open`,
      {
        amount_on_open: storeCash.amount_on_open.toString() || "0",
      }
    );
    storeCash.code = code;
    storeCash.cash_id = cash_id;
    storeCash.history_id = history_id;
    storeCash.store_id = store_id;
    storeCash.is_online = true;

    await this.storeCashRepository.update(storeCash.id, storeCash);
    return storeCash;
  }
}

export const openOnlineStoreCash = new OpenOnlineStoreCash();
