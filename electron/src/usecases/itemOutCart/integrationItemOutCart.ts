import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";

import { checkInternet } from "../../providers/internetConnection";
import odinApi from "../../providers/odinApi";

import { getCurrentStoreCash } from "../storeCash";
import { hasRegistration } from "../store";
import { StoreCashDto, ItemOutCartDto, StoreDto } from "../../models/gestor";
import moment from "moment";
class IntegrationItemOutCart implements IUseCaseFactory {
  constructor(
    private integratedItemOutCartRepository = new BaseRepository<ItemOutCartDto>(
      StorageNames.Integrated_ItemOutCart
    ),
    private notIntegratedItemOutCartRepository = new BaseRepository<ItemOutCartDto>(
      StorageNames.Not_Integrated_ItemOutCart
    ),
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store),
    private getCurrentStoreCashUseCase = getCurrentStoreCash
  ) {}

  async execute(): Promise<void> {
    const hasInternet = await checkInternet();
    const store = await this.storeRepository.getOne();

    const { response: storeCash, has_internal_error: errorOnStoreCash } =
      await useCaseFactory.execute<StoreCashDto | undefined>(
        this.getCurrentStoreCashUseCase
      );

    if (errorOnStoreCash) {
      throw new Error("Falha ao obter caixa atual");
    }

    if (!hasInternet || !storeCash || !store || !storeCash.is_online) {
      return;
    }

    const items = await this.notIntegratedItemOutCartRepository.getAll();
    console.log(items);
    if (items.length) {
      await Promise.all(
        items.map(async (item) => {
          if (item.cash_code === "OFFLINE" && storeCash.code !== "OFFLINE") {
            item.cash_code = storeCash.code;
            await this.notIntegratedItemOutCartRepository.update(item.id, item);
          }

          try {
            await odinApi.post(
              `/items_out_cart/${item.store_id}-${
                item.cash_code || storeCash.code
              }`,
              [
                {
                  ...item,
                  store_id: storeCash.store_id,
                  created_at: moment(item.created_at || new Date()).format(
                    "DD-MM-YYYY HH:mm:ss"
                  ),
                },
              ]
            );
            await this.integratedItemOutCartRepository.create(item);
            await this.notIntegratedItemOutCartRepository.deleteById(item.id);
          } catch (error) {
            console.log(error);
          }
        })
      );
    }
  }
}

export const integrationItemOutCart = new IntegrationItemOutCart();
