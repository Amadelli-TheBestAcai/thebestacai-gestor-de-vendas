import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import midasApi from "../../providers/midasApi";
import { SaleDto, StoreCashDto } from "../../models/gestor";
import { salesFormaterToIntegrate } from "../../helpers/salesFormaterToIntegrate";

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
    )
  ) { }

  async execute(): Promise<void> {
    const is_online = await checkInternet();
    if (!is_online) {
      return;
    }
    const storeCash = await this.storeCashRepository.getOne()

    if (!storeCash?.is_opened || !storeCash?.is_online) {
      return;
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
