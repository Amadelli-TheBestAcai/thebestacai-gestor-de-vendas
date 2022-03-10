import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";

import { checkInternet } from "../../providers/internetConnection";
import odinApi from "../../providers/odinApi";

import { getCurrentStoreCash } from "../storeCash";
import { hasRegistration } from "../store";
import { StoreCashDto, ItemOutCartDto, StoreDto } from "../../models/gestor";

class IntegrationItemOutCart implements IUseCaseFactory {
  constructor(
    private integratedItemOutCartRepository = new BaseRepository<ItemOutCartDto>(
      StorageNames.Integrated_ItemOutCart
    ),
    private notIntegratedItemOutCartRepository = new BaseRepository<ItemOutCartDto>(
      StorageNames.Not_Integrated_ItemOutCart
    ),
    private getCurrentStoreCashUseCase = getCurrentStoreCash,
    private hasRegistrationUseCase = hasRegistration
  ) { }

  async execute(): Promise<void> {
    const hasInternet = await checkInternet();

    const { response: storeCash, has_internal_error: errorOnStoreCash } =
      await useCaseFactory.execute<StoreCashDto | undefined>(
        this.getCurrentStoreCashUseCase
      );

    if (errorOnStoreCash) {
      throw new Error("Falha ao obter caixa atual");
    }

    const { response: store, has_internal_error: errorOnStore } =
      await useCaseFactory.execute<StoreDto | undefined>(
        this.hasRegistrationUseCase
      );

    if (errorOnStore) {
      throw new Error("Falha ao obter loja registrada");
    }

    if (!hasInternet || !storeCash || !store || !storeCash.is_online) {
      return;
    }

    const items = await this.notIntegratedItemOutCartRepository.getAll();

    if (items.length) {
      await Promise.all(
        items.map(async item => {
          try {
            await odinApi.post(
              `/items_out_cart/${item.store_id}-${item.cash_code || storeCash.code}`,
              items
            );
            await this.integratedItemOutCartRepository.create(item);
            await this.notIntegratedItemOutCartRepository.deleteById(item.id);
          } catch (error) {
            console.log(error)
          }
        })
      )
    }
  }
}

export const integrationItemOutCart = new IntegrationItemOutCart();
