import { IUseCaseFactory } from "../useCaseFactory.interface";
import { SaleDto } from "../../models/gestor";
import midasApi from "../../providers/midasApi";

class GetSalesByCashHistories implements IUseCaseFactory {
    async execute(histories_ids: number[]): Promise<SaleDto[]> {
        const {
            data: { content },
        } = await midasApi.get(`/sales/history?history_ids=${histories_ids.join(",")}`);
        return content;
    }
}

export const getSalesByCashHistories = new GetSalesByCashHistories();
