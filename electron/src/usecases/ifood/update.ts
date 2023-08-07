import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { IfoodDto } from "../../models/gestor";

import { findOrCreate } from "./findOrCreate";

class Update implements IUseCaseFactory {
  constructor(
    private ifoodRepository = new BaseRepository<IfoodDto>(StorageNames.Ifood)
  ) {}

  async execute(payload: Partial<IfoodDto>): Promise<IfoodDto> {
    let ifood = await findOrCreate.execute();

    ifood = (await this.ifoodRepository.update(ifood.id, payload)) as IfoodDto;

    return ifood;
  }
}

export const update = new Update();
