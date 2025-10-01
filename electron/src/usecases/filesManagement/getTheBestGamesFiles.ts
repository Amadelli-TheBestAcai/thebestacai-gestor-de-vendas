import { checkInternet } from "../../providers/internetConnection";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import janusApi from "../../providers/janusApi";

class GetTheBestGamesFiles implements IUseCaseFactory {
  async execute(): Promise<any> {
    const isConnectInternet = await checkInternet();
    if (!isConnectInternet) {
      throw new Error(
        "Sem conexão com a internet. Verifique sua conexão para usar o serviço TEF e tente novamente."
      );
    }

    const { data } = await janusApi.get(
      `/files-management/ti/files-the-best-games/teste-the-best-game.png/beautify`
    );

    return data;
  }
}

export const getTheBestGamesFiles = new GetTheBestGamesFiles();
