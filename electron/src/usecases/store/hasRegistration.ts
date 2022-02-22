import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import { StoreDto } from "../../models/gestor";
import janusApi from "../../providers/janusApi";
import user from "../../models/user";

class HasRegistration implements IUseCaseFactory {
  constructor(
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store)
  ) {}

  async execute(): Promise<StoreDto[]> {
    const hasInternet = await checkInternet();
    if (!hasInternet) {
      return [];
    }

    const {
      data: { content },
    } = await janusApi.get(`/companyUser/${user.loggedUser?.id}/user`);

    return content;
  }
}

export const hasRegistration = new HasRegistration();
