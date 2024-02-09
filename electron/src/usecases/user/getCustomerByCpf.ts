import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { SaleDto } from "../../models/gestor";

import { checkInternet } from "../../providers/internetConnection";
import thorApi from "../../providers/thorApi";

interface Request {
  cpf: string;
}

class GetCustomerByCpf implements IUseCaseFactory {
  constructor(
    private saleRepository = new BaseRepository<SaleDto>(StorageNames.Sale)
  ) {}

  async execute({ cpf }: Request) {
    const hasInternet = await checkInternet();

    if (hasInternet && cpf.length === 11) {
      const {
        data: { content },
      } = await thorApi.get(`/customer/find_user/${cpf}`);

      return content;
    }
  }
}

export const getCustomerByCpf = new GetCustomerByCpf();
