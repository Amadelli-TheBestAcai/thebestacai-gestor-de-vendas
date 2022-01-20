import { BaseRepository } from "../repository/baseRepository";
import { IBaseRepository } from "../repository/baseRepository.interface";
import storeCashModel from "./storeCash";
import storeModel from "./store";
import { checkInternet } from "../providers/internetConnection";
import odinApi from "../providers/odinApi";
import { v4 } from "uuid";

export type Entity = {
  id: string;
  reason: string;
  product_id: number;
  to_integrate: boolean;
  created_at?: Date;
  deleted_at?: Date;
};

class ItemOutCart extends BaseRepository<Entity> {
  private notIntegratedQueueRepository: IBaseRepository<Entity>;
  private integrateQueueRepository: IBaseRepository<Entity>;
  constructor(storageName = "ItemOutCart") {
    super(storageName);
    this.notIntegratedQueueRepository = new BaseRepository<Entity>(
      "Not_Integrated_ItemOutCart"
    );
    this.integrateQueueRepository = new BaseRepository<Entity>(
      "Integrated_ItemOutCart"
    );
  }

  async insert(reason: string, product_id: number): Promise<Entity> {
    const newItem: Entity = {
      id: v4(),
      to_integrate: false,
      reason,
      product_id,
    };
    await this.create(newItem);

    await this.integration();

    return newItem;
  }

  async moveToPreIntegration(): Promise<void> {
    const items = await this.getAll();

    const itemsToIntegrate = items.filter((_item) => _item.to_integrate);

    await this.notIntegratedQueueRepository.createMany(itemsToIntegrate);

    const itemsToNotIntegrate = items.filter((_item) => !_item.to_integrate);
    await this.createMany(itemsToNotIntegrate);
  }

  async integration(): Promise<void> {
    await this.moveToPreIntegration();

    const hasInternet = await checkInternet();
    const storeCash = await storeCashModel.getCurrentCash();
    const store = await storeModel.hasRegistration();

    if (!hasInternet || !storeCash || !store) {
      return;
    }

    const items = await this.notIntegratedQueueRepository.getAll();

    try {
      await odinApi.post(
        `/items_out_cart/${store.company.id}-${storeCash.code}`,
        [items]
      );
      await this.integrateQueueRepository.createMany(items);
      await this.notIntegratedQueueRepository.clear();
    } catch (error) {
      console.log(error);
    }
  }
}

export default new ItemOutCart();
