import apm from "elastic-apm-node";
import { checkInternet } from "./internetConnection";
import winston, { Logger } from "winston";
import {
  ElasticsearchTransport,
  ElasticsearchTransportOptions,
} from "winston-elasticsearch";

import { BaseRepository } from "../repository/baseRepository";
import { StorageNames } from "../repository/storageNames";
import { StoreDto, StoreCashDto } from "../models/gestor";
import moment from "moment";
import env from "./env.json";

class ElasticApm {
  private logger: Logger
  private startTime = new Date();
  constructor(
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store),
    private storeCashRepository = new BaseRepository<StoreCashDto>(
      StorageNames.StoreCash
    ),
    private apmTempRepository = new BaseRepository<any>(StorageNames.Apm_Temp)
  ) {
    const esTransportOpts: ElasticsearchTransportOptions = {
      apm,
      level: 'info',
      indexPrefix: 'gestor',
      indexSuffixPattern: 'YYYY.MM.DD',
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
  }

  start(): void {
    this.startTime = new Date();
  }

  async finish(data: any): Promise<void> {
    if (env.ELASTIC_SHOULD_LOG !== "true") {
      return;
    }

    const endTime = new Date();
    const diff = (endTime.getTime() - this.startTime.getTime()) / 1000;
    const store = await this.storeRepository.getOne();
    const storeCash = await this.storeCashRepository.getOne();

    const log = {
      store: store?.company.company_name,
      historyId: storeCash?.history_id,
      storeCashId: storeCash?.id,
      storeCash: storeCash?.code,
      duration: +Math.abs(diff).toFixed(4),
      created_at: moment(new Date()).format("yyyy-MM-DDTHH:mm:ss"),
      ...data,
    };

    const hasInternet = await checkInternet();

    if (hasInternet) {
      this.logger.info(log)

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
      this.logger.info(payload)
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

export const elasticApm = new ElasticApm();
