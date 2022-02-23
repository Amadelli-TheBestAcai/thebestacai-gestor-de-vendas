import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import odinApi from "../../providers/odinApi";
import { checkInternet } from "../../providers/internetConnection";
import {
  StoreDto,
  StoreCashDto,
  AvailableStoreCashes,
} from "../../models/gestor";

class GetAvailableStoreCashes implements IUseCaseFactory {
  constructor(
    private storeCashRepository = new BaseRepository<StoreCashDto>(
      StorageNames.StoreCash
    ),
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store)
  ) {}

  async execute(): Promise<AvailableStoreCashes[] | undefined> {
    const isOnline = await checkInternet();
    if (isOnline) {
      const currentStore = await this.storeRepository.getOne();
      const {
        data: { data },
      } = await odinApi.get(
        `/store_cashes/${currentStore?.company_id}/summary`
      );
      const { open, closed } = data;
      let cashes = open.map((cash) => ({
        store_cash: cash.split("-")[1],
        available: false,
      }));

      cashes = [
        ...closed.map((cash) => ({
          store_cash: cash.split("-")[1],
          available: true,
        })),
        ...cashes,
      ];
      cashes = cashes.sort(
        (firstCash, secondCash) =>
          +firstCash.store_cash - +secondCash.store_cash
      );
      return cashes;
    } else {
      return [
        { store_cash: "01", available: false },
        { store_cash: "02", available: false },
        { store_cash: "03", available: false },
        { store_cash: "04", available: false },
        { store_cash: "05", available: false },
        { store_cash: "OFFLINE", available: true },
      ];
    }
  }
}

export const getAvailableStoreCashes = new GetAvailableStoreCashes();
