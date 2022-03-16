import { IUseCaseFactory } from "../useCaseFactory.interface";
import { checkInternet } from "../../providers/internetConnection";
import { AuditDto } from "../../models/gestor";
import odinApi from "../../providers/odinApi";

interface Request {
  id: number;
  page: number;
  size: number;
}

class GetProductStoreHistory implements IUseCaseFactory {
  constructor() {}

  async execute({ id, page, size }: Request): Promise<AuditDto> {
    const hasInternet = await checkInternet();
    if (!hasInternet) {
      return { audits: [], totalElements: 0 };
    }
    const {
      data: { content, totalElements },
    } = await odinApi.get(
      `/products_store_history/${id}?page=${page}&size=${size}`
    );
    return { audits: content, totalElements: totalElements };
  }
}

export const getProductStoreHistory = new GetProductStoreHistory();
