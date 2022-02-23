import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import midasApi from "../../providers/midasApi";
import { SaleDto } from "../../models/gestor";
import { salesFormaterToIntegrate } from "../../helpers/salesFormaterToIntegrate";

class OnlineIntegration implements IUseCaseFactory {
  constructor(
    private notIntegratedSaleRepository = new BaseRepository<SaleDto>(
      StorageNames.Not_Integrated_Sale
    ),
    private integrateSaleRepository = new BaseRepository<SaleDto>(
      StorageNames.Integrated_Sale
    )
  ) {}

  async execute(): Promise<void> {
    const is_online = await checkInternet();
    if (!is_online) {
      return;
    }
    try {
      const sales: SaleDto[] = await this.notIntegratedSaleRepository.getAll();

      const salesOnline: SaleDto[] = sales.filter((_sale) => _sale.is_online);

      const payload = salesFormaterToIntegrate(salesOnline);

      if (payload.length) {
        await midasApi.post("/sales", payload);
      }

      await this.notIntegratedSaleRepository.clear();

      await this.integrateSaleRepository.createMany(salesOnline);
    } catch (error) {
      console.log(error);
    }
  }
}

export const onlineIntegration = new OnlineIntegration();
