import { checkInternet } from "./internetConnection";
import { BaseRepository } from "../repository/baseRepository";
import { StorageNames } from "../repository/storageNames";
import { StoreDto, StoreCashDto, UserDto } from "../models/gestor";
import env from './env.json'
import moment from "moment";
import axios from 'axios'

class AppInsights {
  private startTime = new Date();
  constructor(
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store),
    private userRepository = new BaseRepository<UserDto>(StorageNames.User),
    private storeCashRepository = new BaseRepository<StoreCashDto>(
      StorageNames.StoreCash
    ),
    private apmTempRepository = new BaseRepository<any>(StorageNames.Apm_Temp)
  ) { }

  private async sendToApi(log) {
    await axios({
      url: '/appInsights/log',
      method: 'POST',
      baseURL: env.API_DASH,
      data: log
    })
  }

  start(): void {
    this.startTime = new Date();
  }

  async finish(name: string, data: any): Promise<void> {
    const endTime = new Date();
    const diff = (endTime.getTime() - this.startTime.getTime()) / 1000;
    const store = await this.storeRepository.getOne();
    const storeCash = await this.storeCashRepository.getOne();
    const log = {
      name,
      store: store?.company.company_name,
      historyId: storeCash?.history_id,
      storeCashId: storeCash?.id,
      storeCash: storeCash?.code,
      duration: +Math.abs(diff).toFixed(4),
      created_at: moment(new Date()).format("DD/MM/YYYY HH:MM:SS"),
      ...data,
    };
    const hasInternet = await checkInternet();

    if (hasInternet) {
      await this.sendToApi(log)

      const notIntegratedLogs = await this.apmTempRepository.getAll();

      if (notIntegratedLogs.length) {
        await Promise.all(
          notIntegratedLogs.map(async (nextPayload) => {
            await this.integrateTempLogs(nextPayload);
          })
        );
      }
    } else {
      await this.apmTempRepository.create(log);
    }
  }



  private async integrateTempLogs(payload) {
    try {
      await this.sendToApi(payload)
      await this.apmTempRepository.deleteById(payload.id);
    } catch (error) {
      await this.apmTempRepository.create({
        message: "Falha ao integrar com a cloud",
        payload,
        error,
      });
    }
  }
}

export const appInsights = new AppInsights();
