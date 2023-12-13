import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import midasApi from "../../providers/midasApi";
import { StoreCashDto, SaleDto } from "../../models/gestor";
import moment from "moment";

interface Request {
  id: number,
  cash_history_id: number,
  ref: string,
  justify: string
}

class DeleteSaleFromApi implements IUseCaseFactory {
  constructor(
    private storeCashRepository = new BaseRepository<StoreCashDto>(
      StorageNames.StoreCash
    ),
    private integratedSaleRepository = new BaseRepository<SaleDto>(
      StorageNames.Integrated_Sale
    )
  ) { }

  async execute({ id, cash_history_id, ref, justify }: Request): Promise<any> {
    try {
      const is_online = await checkInternet();
      if (!is_online) {
        return;
      }

      const currentCash = await this.storeCashRepository.getOne();

      if (!currentCash || !currentCash.is_opened) {
        return;
      }

      const { store_id, code } = currentCash;
      if (!store_id || !code) {
        return;
      }
      await midasApi.delete(`/sales/${id}?store_id=${store_id}&justify=${justify}`)

      const saleToDelete = await this.integratedSaleRepository.getOne({
        cash_history_id,
        ref
      })
      await this.integratedSaleRepository.update(saleToDelete?.id, { ...saleToDelete, deleted_at: moment(new Date()).format("yyyy-MM-DDTHH:mm:ss") })
    } catch (error: any) {
      console.log(error);
      throw new Error(error.response.data.message)
    }
  }
}

export const deleteSaleFromApi = new DeleteSaleFromApi();
