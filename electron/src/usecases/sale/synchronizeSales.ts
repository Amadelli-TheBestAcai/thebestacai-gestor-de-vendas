import { IUseCaseFactory } from "../useCaseFactory.interface";
import { SaleDto, StoreCashDto } from "../../models/gestor";
import { BaseRepository } from "../../repository/baseRepository";
import { StorageNames } from "../../repository/storageNames";
import { useCaseFactory } from "../useCaseFactory";
import { getSaleFromApi } from "./getSaleFromApi";

class SynchronizeSales implements IUseCaseFactory {
    constructor(
        private storeCashRepository = new BaseRepository<StoreCashDto>(
            StorageNames.StoreCash
        ),
        private integratedSaleRepository = new BaseRepository<SaleDto>(
            StorageNames.Integrated_Sale
        ),
        private notIntegratedSaleRepository = new BaseRepository<SaleDto>(
            StorageNames.Not_Integrated_Sale
        ),
        private getSaleFromApiUseCase = getSaleFromApi
    ) { }

    async execute(): Promise<void> {
        const storeCash = await this.storeCashRepository.getOne();

        if (!storeCash) {
            throw new Error(
                "Não foi possível obter os dados do caixa. Por favor, tente novamente."
            );
        }

        const { has_internal_error: errorOnGetSalesFromApi, response: salesResponseApi } =
            await useCaseFactory.execute<SaleDto[]>(this.getSaleFromApiUseCase, { withClosedCash: true });

        if (errorOnGetSalesFromApi) {
            throw new Error("Falha ao buscar vendas do servidor. Fechamento de caixa cancelado.");
        }

        const notIntegratedSales = await this.notIntegratedSaleRepository.getAll({
            cash_history_id: storeCash.history_id
        })

        const integratedSales = await this.integratedSaleRepository.getAll({
            cash_history_id: storeCash.history_id
        })

        const localSales = [...notIntegratedSales, ...integratedSales];

        const apiSaleRefs = new Set((salesResponseApi ?? []).map(sale => sale.ref));

        const salesNotInApi: SaleDto[] = localSales.filter(
            (sale) => !apiSaleRefs.has(sale.ref)
        );

        console.log(salesNotInApi, 'salesNotInApi')

    }
}

export const synchronizeSales = new SynchronizeSales();
