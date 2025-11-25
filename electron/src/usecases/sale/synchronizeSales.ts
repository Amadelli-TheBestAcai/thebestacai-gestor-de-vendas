import { IUseCaseFactory } from "../useCaseFactory.interface";
import { SaleDto, StoreCashDto, StoreDto } from "../../models/gestor";
import { BaseRepository } from "../../repository/baseRepository";
import { StorageNames } from "../../repository/storageNames";
import { useCaseFactory } from "../useCaseFactory";
import midasApi from "../../providers/midasApi";
import { salesFormaterToIntegrate } from "../../helpers/salesFormaterToIntegrate";
import { redeemReward } from "./redeemReward";
import { getUser } from "../user";
import { getSalesByCashHistories } from "./getSaleByCashHistory";

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
        private integrateSaleRepository = new BaseRepository<SaleDto>(
            StorageNames.Integrated_Sale
        ),
        private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store),
        private getSalesByCashHistoriesUseCase = getSalesByCashHistories,
        private redeemRewardUseCase = redeemReward,
        private getUserUseCase = getUser
    ) { }

    async execute(): Promise<void> {
        const store = (await this.storeRepository.getOne()) as StoreDto;

        if (!store) {
            throw new Error("Não foi possível obter os dados da loja.");
        }

        const storeCash = await this.storeCashRepository.getOne();

        if (!storeCash) {
            throw new Error(
                "Não foi possível obter os dados do caixa. Por favor, tente novamente."
            );
        }

        const notIntegratedSales = await this.notIntegratedSaleRepository.getAll({
            cash_history_id: storeCash.history_id
        })

        const integratedSales = await this.integratedSaleRepository.getAll({
            cash_history_id: storeCash.history_id
        })

        const localSales = [...notIntegratedSales, ...integratedSales];

        const cashHistories = Array.from(new Set(localSales.map(sale => sale.cash_history_id)));

        const { has_internal_error: errorOnGetSalesFromApi, response: salesResponseApi } =
            await useCaseFactory.execute<SaleDto[]>(this.getSalesByCashHistoriesUseCase, cashHistories);

        if (errorOnGetSalesFromApi) {
            throw new Error("Falha ao buscar vendas do servidor. Fechamento de caixa cancelado.");
        }

        const apiSaleRefs = new Set((salesResponseApi ?? []).map(sale => sale.ref));

        const salesNotInApi: SaleDto[] = localSales.filter(
            (sale) => !apiSaleRefs.has(sale.ref)
        );

        try {
            if (salesNotInApi.length) {
                await Promise.all(
                    salesNotInApi.map(async (salePayload) => {
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

export const synchronizeSales = new SynchronizeSales();
