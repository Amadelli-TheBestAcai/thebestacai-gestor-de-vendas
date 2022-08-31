import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { StoreDto } from "../../models/gestor";
import janusApi from '../../providers/janusApi'

class HasRegistration implements IUseCaseFactory {
  constructor(
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store)
  ) { }

  async execute(): Promise<StoreDto | undefined> {
    const store = await this.storeRepository.getOne();

    if (!store) {
      return undefined;
    }

    try {
      const { data } = await janusApi.get(`/companyUser/${store.id}`)

      if (data?.content) {
        await this.storeRepository.clear();
        await this.storeRepository.create(data.content);
        return data.content
      }
    } catch (error) {
      console.log({
        message: 'Falha ao obter loja',
        error
      })
    }

    return store;
  }
}

export const hasRegistration = new HasRegistration();
