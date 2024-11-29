import { BaseRepository } from "../../repository/baseRepository";
import database from "../../providers/database";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import odinApi from "../../providers/odinApi";
import { checkInternet } from "../../providers/internetConnection";
import { StoreDto, StoreCashDto, SettingsDto } from "../../models/gestor";

class OpenOnlineStoreCash implements IUseCaseFactory {
  constructor(
    private storeCashRepository = new BaseRepository<StoreCashDto>(
      StorageNames.StoreCash
    ),
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store),
    private settingsRepository = new BaseRepository<SettingsDto>(
      StorageNames.Settings
    )
  ) {}

  async execute(): Promise<StoreCashDto | undefined> {
    const hasConnection = await checkInternet();
    if (!hasConnection) {
      throw new Error("Sem conexão com a internet. Por favor, verifique sua conexão.");
    }

    const storeCash = (await this.storeCashRepository.getOne()) as StoreCashDto;
    const store = (await this.storeRepository.getOne()) as StoreDto;
    const settings = (await this.settingsRepository.getOne()) as SettingsDto;

    if (settings.should_open_casher === false) {
      throw new Error(
        "Nenhum caixa está disponível para abertura, entre em contato com o suporte"
      );
    }

    const {
      data: { data },
    } = await odinApi.get(`/store_cashes/${store?.company_id}/summary`);

    const { closed } = data;

    const cashes: string[] = closed.map((cash) => cash.split("-")[1]);

    if (!cashes.length) {
      throw new Error(
        "Nenhum caixa está disponível para abertura, entre em contato com o suporte"
      );
    }

    const code = cashes[0];

    const {
      data: {
        data: { cash_id, history_id },
      },
    } = await odinApi.put(`/store_cashes/${store?.company_id}-${code}/open`, {
      amount_on_open: storeCash.amount_on_open.toString() || "0",
    });

    storeCash.code = code;
    storeCash.cash_id = cash_id;
    storeCash.history_id = history_id;
    storeCash.is_online = true;

    await this.storeCashRepository.update(storeCash.id, storeCash);

    return storeCash;
  }
}

export const openOnlineStoreCash = new OpenOnlineStoreCash();
