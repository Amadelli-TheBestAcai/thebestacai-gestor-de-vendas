import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import thorApi from "../../providers/thorApi";
import { StoreCashDto } from "../../models/gestor";
import { CustomerVoucherDTO } from "../../models/dtos/customerVoucher";

interface Request {
  hash_code: string;
}

class GetVoucher implements IUseCaseFactory {
  constructor(
    private storeCashRepository = new BaseRepository<StoreCashDto>(
      StorageNames.StoreCash
    )
  ) { }

  async execute({ hash_code }: Request): Promise<CustomerVoucherDTO> {
    const is_online = await checkInternet();
    if (!is_online) {
      throw new Error("Falha ao validar conexão de internet");
    }

    const { data } = await thorApi.get(`/customerVoucher/hash/${hash_code}`);

    return data.content;
  }
}

export const getVoucher = new GetVoucher();
