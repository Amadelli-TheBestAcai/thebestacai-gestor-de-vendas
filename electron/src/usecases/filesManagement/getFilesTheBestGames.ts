import { checkInternet } from "../../providers/internetConnection";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import janusApi from "../../providers/janusApi";

class GetFilesTheBestGames implements IUseCaseFactory {
  async execute(): Promise<any> {
    const isConnectInternet = await checkInternet();
    if (!isConnectInternet) {
      throw new Error(
        "Sem conexão com a internet. Verfique sua conexão com a internet e tente novamente."
      );
    }

    const { data } = await janusApi.get(
      `/files-management/ti/files-the-best-games/[BR]-the-best-game-files.json/beautify`
    );

    return data;
  }
}

export const getFilesTheBestGames = new GetFilesTheBestGames();
