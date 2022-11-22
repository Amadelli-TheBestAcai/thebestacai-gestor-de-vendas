import cron from "node-cron";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import midasApi from "../../providers/midasApi";
import { SaleDto, StoreCashDto } from "../../models/gestor";
import { salesFormaterToIntegrate } from "../../helpers/salesFormaterToIntegrate";
import { openOnlineStoreCash } from "../storeCash";
import { useCaseFactory } from "../useCaseFactory";

class OnlineIntegration implements IUseCaseFactory {
  constructor(
    private storeCashRepository = new BaseRepository<StoreCashDto>(
      StorageNames.StoreCash
    ),
    private notIntegratedSaleRepository = new BaseRepository<SaleDto>(
      StorageNames.Not_Integrated_Sale
    ),
    private integrateSaleRepository = new BaseRepository<SaleDto>(
      StorageNames.Integrated_Sale
    ),
    private openOnlineStoreCashUseCase = openOnlineStoreCash
  ) {
    cron.schedule("*/5 * * * *", async () => {
      // await this.execute()
      // console.log("Integration job was finished")
    });
  }

  async execute(): Promise<void> {
    const is_online = await checkInternet();
    if (!is_online) {
      return;
    }

    let storeCash = await this.storeCashRepository.getOne() as StoreCashDto

    const isOpeningOfflineStoreCash = storeCash?.is_opened && !storeCash?.is_online

    if (isOpeningOfflineStoreCash) {
      const { response: openedOnlineStoreCash, has_internal_error: errorOnOpenOnlineStoreCash, error_message } =
        await useCaseFactory.execute<StoreCashDto>(this.openOnlineStoreCashUseCase);

      if (errorOnOpenOnlineStoreCash) {
        throw new Error(error_message || "Falha ao abrir caixa online");
      }
      storeCash = openedOnlineStoreCash as StoreCashDto
    }

    try {
      const sales: SaleDto[] = await this.notIntegratedSaleRepository.getAll();

      if (sales.length) {
        await Promise.all(
          sales.map(async salePayload => {
            try {
              const payload = salesFormaterToIntegrate(salePayload, storeCash);
              await midasApi.post("/sales", payload)
              await this.notIntegratedSaleRepository.deleteById(salePayload.id);
              await this.integrateSaleRepository.create({
                ...salePayload,
                cash_history_id: salePayload.cash_history_id || storeCash.history_id,
                cash_id: salePayload.cash_id || storeCash.cash_id
              });
            } catch (error) {
              console.log(error)
            }
          })
        )
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export const onlineIntegration = new OnlineIntegration();
