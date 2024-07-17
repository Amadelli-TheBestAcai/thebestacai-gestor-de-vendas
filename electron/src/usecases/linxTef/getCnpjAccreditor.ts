import { checkInternet } from "../../providers/internetConnection";
import configsTefApi from "../../providers/configsTefApi";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { ConfigTefDTO } from "../../models/dtos";

class GetCnpjAccreditor implements IUseCaseFactory {
    async execute(): Promise<ConfigTefDTO[]> {
        const isConnectInternet = await checkInternet();
        if (!isConnectInternet) {
            throw new Error("Sem conexão com a internet. Verifique sua conexão para usar o serviço TEF e tente novamente.")
        }

        const { data } = await configsTefApi.get(`/credenciadoras`)
        return data
    }
}

export const getCnpjAccreditor = new GetCnpjAccreditor();
