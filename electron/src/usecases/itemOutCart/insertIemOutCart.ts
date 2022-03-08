import { v4 } from "uuid";
import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";

import { integrationItemOutCart } from "./index";
import { ItemOutCartDto, StoreCashDto, StoreDto } from "../../models/gestor";

interface Request {
  reason: string;
  product_id: number;
}

class InsertItemOutCart implements IUseCaseFactory {
  constructor(
    private itemOutCartRepository = new BaseRepository<ItemOutCartDto>(
      StorageNames.ItemOutCart
    ),
    private notIntegratedItemOutCartRepository = new BaseRepository<ItemOutCartDto>(
      StorageNames.Not_Integrated_ItemOutCart
    ),
    private storeCashRepository = new BaseRepository<StoreCashDto>(
      StorageNames.StoreCash
    ),
    private storeRepository = new BaseRepository<StoreDto>(
      StorageNames.Store
    ),
    private integrateItemOutCartUseCase = integrationItemOutCart,
  ) { }

  async execute({ product_id, reason }: Request): Promise<ItemOutCartDto> {
    const storeCash = await this.storeCashRepository.getOne()
    const store = await this.storeRepository.getOne()

    const newItem: ItemOutCartDto = {
      id: v4(),
      to_integrate: true,
      cash_code: storeCash?.code,
      store_id: store?.company.id,
      reason,
      product_id,
    };

    await this.itemOutCartRepository.create(newItem);

    await this.notIntegratedItemOutCartRepository.create(newItem);

    await useCaseFactory.execute<ItemOutCartDto | undefined>(
      this.integrateItemOutCartUseCase
    );

    return newItem;
  }
}

export const insertItemOutCart = new InsertItemOutCart();
