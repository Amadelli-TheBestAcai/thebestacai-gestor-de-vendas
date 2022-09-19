import { BaseRepository } from "../../repository/baseRepository";
import database from '../../providers/database'
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import odinApi from "../../providers/odinApi";
import { checkInternet } from "../../providers/internetConnection";
import { StoreDto, StoreCashDto } from "../../models/gestor";
import env from '../../providers/env.json'
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
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store),
    private saleRepository = new BaseRepository<StoreDto>(StorageNames.Sale),
    private apmRepository = new BaseRepository<any>(StorageNames.Apm_Temp),
    private integratedSaleRepository = new BaseRepository<StoreDto>(StorageNames.Integrated_Sale),
    private integratedHandlerRepository = new BaseRepository<StoreDto>(StorageNames.Integrated_Handler)
  ) { }

  async execute({
    amount_on_open,
    code,
  }: Request): Promise<StoreCashDto | undefined> {
    const payload: StoreCashDto = {
      id: v4(),
      gv_sales: 0,
      code,
      amount_on_open,
      is_opened: true,
      is_online: false,
    };

    const currentStoreCash = await this.storeCashRepository.getOne()

    const isOpeningOfflineStoreCash = currentStoreCash?.is_opened && !currentStoreCash?.is_online

    if (isOpeningOfflineStoreCash) {
      payload.id = currentStoreCash.id
      payload.gv_sales = currentStoreCash.gv_sales
    }

    const isConnected = await checkInternet();
    if (isConnected) {
      // if (env.API_DASH && env.API_DASH.includes("prd")) {
      //   const dbBackup = await database.backup()

      //   if (dbBackup) {
      //     try {
      //       const formData = new FormData();

      //       formData.append('file', dbBackup)

      //       const { data } = await odinApi.post("/upload-gestordb-backup", formData)

      //       const location = data?.location

      //       await odinApi.put(
      //         `/cash_history/${currentStoreCash?.history_id}`,
      //         {
      //           backup_url: location,
      //         }
      //       )
      //     } catch (error) {
      //       await this.apmRepository.create({
      //         name: "Backup database",
      //         scope: "Gestor de Vendas",
      //         error
      //       })
      //     }
      //   }
      // }
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
    await this.saleRepository.clear();
    await this.integratedSaleRepository.clear();
    await this.integratedHandlerRepository.clear();
    if (isOpeningOfflineStoreCash) {
      await this.storeCashRepository.update(payload.id, payload);
    } else {
      await this.storeCashRepository.clear();
      await this.storeCashRepository.create(payload);
    }
    return payload;
  }
}

export const openStoreCash = new OpenStoreCash();
