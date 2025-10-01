import { checkInternet } from "../../providers/internetConnection";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import janusApi from "../../providers/janusApi";

class GetPdfTheBestGamesFiles implements IUseCaseFactory {
  async execute(): Promise<Buffer> {
    const isConnectInternet = await checkInternet();
    if (!isConnectInternet) {
      throw new Error(
        "Sem conexão com a internet. Verifique sua conexão para usar o serviço TEF e tente novamente."
      );
    }

    const { data } = await janusApi.get(
      `/files-management/ti/files-the-best-games/Teste.pdf/beautify`,
      {
        responseType: "arraybuffer",
      }
    );

    return Buffer.from(data, "binary");
  }
}

export const getPdfTheBestGamesFiles = new GetPdfTheBestGamesFiles();
