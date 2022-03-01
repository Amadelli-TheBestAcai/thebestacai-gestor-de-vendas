import apm from "elastic-apm-node"
import Datastore from 'nedb'
import { checkInternet } from "./internetConnection"
import winston, { Logger } from "winston"
import { ElasticsearchTransport, ElasticsearchTransportOptions } from "winston-elasticsearch"

import { BaseRepository } from "../repository/baseRepository";
import { StorageNames } from "../repository/storageNames";
import { StoreDto, StoreCashDto } from "../models/gestor";
import moment from "moment"
import env from "./env.json"

class ElasticApm {
  private logger: Logger
  private startTime = new Date()
  private apmTempRepository: Datastore
  constructor(
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store),
    private storeCashRepository = new BaseRepository<StoreCashDto>(StorageNames.StoreCash),
  ) {
    const esTransportOpts: ElasticsearchTransportOptions = {
      apm,
      level: 'info',
      clientOpts: {
        cloud: {
          id: env.ELASTIC_ID,
          username: env.ELASTIC_USER,
          password: env.ELASTIC_PASS
        }
      },
    };
    this.logger = winston.createLogger({
      transports: [
        new ElasticsearchTransport(esTransportOpts)
      ]
    });
    this.apmTempRepository = new Datastore({ filename: `${process.env.AppData}/GestorDatabase/apm_temp.db`, autoload: true });
  }

  start(): void {
    this.startTime = new Date()
  }


  async finish(data: any): Promise<void> {
    if (env.ELASTIC_SHOULD_LOG !== "true") {
      return;
    }

    const endTime = new Date();
    const diff = (endTime.getTime() - this.startTime.getTime()) / 1000;
    const store = await this.storeRepository.getOne()
    const storeCash = await this.storeCashRepository.getOne()

    const log = {
      store: store?.company.company_name,
      historyId: storeCash?.history_id,
      storeCashId: storeCash?.id,
      storeCash: storeCash?.code,
      duration: +Math.abs(diff).toFixed(4),
      created_at: moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
      ...data,
    }

    const hasInternet = await checkInternet()

    if (hasInternet) {
      this.logger.info(log)

      const notIntegratedLogs = await this.apmTempRepository.getAllData();

      if (notIntegratedLogs.length) {
        await Promise.all(
          notIntegratedLogs.map(async nextPayload => {
            await this.integrateTempLogs(nextPayload);
          })
        )
      }
    } else {
      await this.apmTempRepository.insert(log)
      const notIntegratedLogs = await this.apmTempRepository.getAllData();
      console.log(notIntegratedLogs)
    }
  }

  private async integrateTempLogs(payload) {
    try {
      this.logger.info(payload)
      await this.apmTempRepository.remove({ _id: payload._id })
    } catch (error) {
      await this.apmTempRepository.insert({
        message: 'Falha ao integrar com a cloud',
        payload,
        error,
      })
    }
  }
}

export const elasticApm = new ElasticApm()