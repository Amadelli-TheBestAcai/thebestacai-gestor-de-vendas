import { v4 } from "uuid";
import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { getUser } from "../user";
import { SaleDto, UserDto, StoreCashDto } from "../../models/gestor";

interface Request {
  withPersistence: true;
}

class BuildNewSale implements IUseCaseFactory {
  constructor(
    private saleRepository = new BaseRepository<SaleDto>(StorageNames.Sale),
    private storeCashRepository = new BaseRepository<StoreCashDto>(
      StorageNames.StoreCash
    ),
    private getUserUseCase = getUser
  ) {}

  async execute({ withPersistence }: Request): Promise<SaleDto> {
    const { response: user, has_internal_error: errorOnGetUser } =
      await useCaseFactory.execute<UserDto>(this.getUserUseCase);

    if (errorOnGetUser) {
      throw new Error("Falha ao obter caixa atual");
    }

    const storeCash = await this.storeCashRepository.getOne();

    const newSale = {
      id: v4(),
      user_id: user?.id,
      quantity: 0,
      change_amount: 0,
      type: 0,
      discount: 0,
      cash_id: storeCash?.cash_id,
      cash_history_id: storeCash?.history_id,
      is_online: storeCash?.history_id && storeCash?.cash_id ? true : false,
      is_current: true,
      is_integrated: false,
      to_integrate: false,
      total_paid: 0,
      total_sold: 0,
      items: [],
      payments: [],
    };
    if (withPersistence) {
      await this.saleRepository.create(newSale);
    }
    return newSale;
  }
}

export const buildNewSale = new BuildNewSale();
