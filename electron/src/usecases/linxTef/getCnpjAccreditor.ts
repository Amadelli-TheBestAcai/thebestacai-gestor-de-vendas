import { checkInternet } from "../../providers/internetConnection";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { ConfigTefDTO } from "../../models/dtos";
import janusApi from "../../providers/janusApi";

class GetCnpjAccreditor implements IUseCaseFactory {
  async execute(): Promise<ConfigTefDTO[]> {
    const isConnectInternet = await checkInternet();
    if (!isConnectInternet) {
      throw new Error(
        "Sem conexão com a internet. Verifique sua conexão para usar o serviço TEF e tente novamente."
      );
    }

    const { data } = await janusApi.get(
      `/files-management/ti/gestor-de-vendas/tef-credenciadoras.json/beautify`
    );

    return data;
  }
}

export const getCnpjAccreditor = new GetCnpjAccreditor();
