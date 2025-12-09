import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import thorApi from "../../providers/thorApi";
import { StoreCashDto } from "../../models/gestor";
import { StoreDto } from "../../models/gestor";

interface Request {
    customerVoucherId: number;
}

class MarkAsUsedVoucher implements IUseCaseFactory {
    constructor(
        private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store)
    ) { }

    async execute({ customerVoucherId }: Request): Promise<void> {
        const is_online = await checkInternet();
        if (!is_online) {
            throw new Error(
                "Para finalizar a venda com cupom é necessário estar online"
            );
        }
        const currentStore = await this.storeRepository.getOne();

        await thorApi.put(`/customerVoucher/mark-as-used`, {
            customerVoucherId: customerVoucherId,
            company_id: currentStore?.company_id,
        });
    }
}

export const markAsUsedVoucher = new MarkAsUsedVoucher();
