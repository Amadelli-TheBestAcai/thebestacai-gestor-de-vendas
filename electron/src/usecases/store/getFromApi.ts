import { useCaseFactory } from "../useCaseFactory";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { checkInternet } from "../../providers/internetConnection";
import { StoreDto, UserDto } from "../../models/gestor";
import janusApi from "../../providers/janusApi";
import { getUser } from "../user/getUser";

class GetFromApi implements IUseCaseFactory {
  constructor(private getUseCaseFactory = getUser) {}

  async execute(): Promise<StoreDto[]> {
    const hasInternet = await checkInternet();
    if (!hasInternet) {
      return [];
    }

    const { response: user, has_internal_error: errorOnGetCurrentUser } =
      await useCaseFactory.execute<UserDto>(this.getUseCaseFactory);

    if (errorOnGetCurrentUser) {
      throw new Error("Erro ao obter usuário atual");
    }

    if (!user) {
      throw new Error("Nenhum usuário encontrado");
    }

    const {
      data: { content },
    } = await janusApi.get(`/companyUser/${user.id}/user`);

    return content;
  }
}

export const getFromApi = new GetFromApi();
