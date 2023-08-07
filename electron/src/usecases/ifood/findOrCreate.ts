import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { IfoodDto } from "../../models/gestor";
import { v4 } from "uuid";

class FindOrCreate implements IUseCaseFactory {
  constructor(
    private ifoodRepository = new BaseRepository<IfoodDto>(StorageNames.Ifood)
  ) {}

  async execute(): Promise<IfoodDto> {
    let ifood = await this.ifoodRepository.getOne();
    if (!ifood) {
      ifood = await this.ifoodRepository.create({
        id: v4(),
        orders: [],
      });
    }
    return ifood;
  }
}

export const findOrCreate = new FindOrCreate();
