import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import midasApi from "../../providers/midasApi";
import { SaleDto, StoreCashDto, StoreDto } from "../../models/gestor";
import { salesFormaterToIntegrate } from "../../helpers/salesFormaterToIntegrate";
import { openOnlineStoreCash } from "../storeCash";
import { useCaseFactory } from "../useCaseFactory";
import { redeemReward } from "./redeemReward";
import { getUser } from "../user/getUser";
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
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store),
    private openOnlineStoreCashUseCase = openOnlineStoreCash,
    private redeemRewardUseCase = redeemReward,
    private getUserUseCase = getUser
  ) {}

  async execute(): Promise<void> {
    const is_online = await checkInternet();
    if (!is_online) {
      throw new Error("Não foi possível detectar uma conexão com a internet. Por favor, verifique sua conexão.");
    }

    let storeCash = (await this.storeCashRepository.getOne()) as StoreCashDto;
    let store = (await this.storeRepository.getOne()) as StoreDto;

    const isOpeningOfflineStoreCash =
      storeCash?.is_opened && !storeCash?.is_online;

    if (isOpeningOfflineStoreCash) {
      const {
        response: openedOnlineStoreCash,
        has_internal_error: errorOnOpenOnlineStoreCash,
        error_message,
      } = await useCaseFactory.execute<StoreCashDto>(
        this.openOnlineStoreCashUseCase
      );

      if (errorOnOpenOnlineStoreCash) {
        throw new Error(error_message || "Falha ao abrir caixa online");
      }
      storeCash = openedOnlineStoreCash as StoreCashDto;

      const salesWithoutCashHistory = await this.notIntegratedSaleRepository.getAll({
        $and: [
          { $or: [{ cash_history_id: { $exists: false } }, { cash_history_id: null }] },
          { $or: [{ history_id: { $exists: false } }, { history_id: null }] }
        ]
      });

      if (salesWithoutCashHistory.length > 0) {
        await Promise.all(
          salesWithoutCashHistory.map(async (sale) => {
            await this.notIntegratedSaleRepository.update(sale.id, {
              cash_history_id: storeCash?.history_id,
              cash_id: storeCash?.cash_id
            });
          })
        );
      }
    }

    try {
      const sales: SaleDto[] = await this.notIntegratedSaleRepository.getAll();
      console.log(sales, 'sales')

      if (sales.length) {
        await Promise.all(
          sales.map(async (salePayload) => {
            try {
              if (salePayload.customer_reward_id) {
                const user = await this.getUserUseCase.execute();
                const redeemPayload = {
                  store_id: store.company_id,
                  user_name: user?.name as string,
                  user_id: user?.id as number,
                  company_name: store.company.company_name,
                };
                await this.redeemRewardUseCase.execute({
                  id: salePayload.customer_reward_id,
                  payload: redeemPayload,
                });
              }
              let payload = salesFormaterToIntegrate(salePayload, storeCash);
              payload = payload.map((sale) => ({
                ...sale,
                store_id: storeCash.store_id,
              }));
              await midasApi.post("/sales", payload);
              await this.notIntegratedSaleRepository.deleteById(salePayload.id);
              console.log(salePayload.cash_history_id, 'salePayload.cash_history_id');
              console.log(storeCash.history_id, 'storeCash.history_id');
              await this.integrateSaleRepository.create({
                ...salePayload,
                cash_history_id:
                  salePayload.cash_history_id || storeCash.history_id,
                cash_id: salePayload.cash_id || storeCash.cash_id,
              });
            } catch (error) {
              console.log(error);
            }
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export const onlineIntegration = new OnlineIntegration();
