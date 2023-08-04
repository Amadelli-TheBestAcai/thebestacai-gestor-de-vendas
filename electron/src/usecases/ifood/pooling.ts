import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import { IfoodDto } from "../../models/gestor/ifood";
import { v4 } from "uuid";
import { authentication } from "./authentication";

class Pooling implements IUseCaseFactory {
  constructor(
    private ifoodRepository = new BaseRepository<IfoodDto>(StorageNames.Ifood)
  ) {}

  async execute(): Promise<IfoodDto> {
    const hasInternet = await checkInternet();
    if (hasInternet) {
      let ifood = await this.ifoodRepository.getOne();
      if (!ifood) {
        ifood = await this.ifoodRepository.create({
          id: v4(),
          orders: [],
        });
      }
      ifood = await authentication.execute(ifood);

      await this.ifoodRepository.update(ifood.id, ifood);
      return ifood;
    } else {
      throw new Error("Aplicação sem conexão com internet");
    }
  }
}

export const pooling = new Pooling();
