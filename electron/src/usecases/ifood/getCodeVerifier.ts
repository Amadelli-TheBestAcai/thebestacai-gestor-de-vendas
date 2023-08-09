import { shell } from "electron";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import { AxiosRequestConfig } from "axios";

import { IfoodDto } from "../../models/gestor";
import env from "../../providers/env.json";
import { findOrCreate } from "./findOrCreate";

import { formUrlEncoded } from "../../helpers/formUrlEncoded";
import { CodeVerifierDto } from "./dtos/codeVerifier";
import { ipcRenderer } from "electron";

class GetCodeVerifier implements IUseCaseFactory {
  constructor(
    private ifoodRepository = new BaseRepository<IfoodDto>(StorageNames.Ifood)
  ) {}

  async execute(): Promise<CodeVerifierDto> {
    const hasInternet = await checkInternet();
    if (hasInternet) {
      let data = await ipcRenderer.invoke("request-handler", {
        method: "POST",
        url: "https://merchant-api.ifood.com.br/authentication/v1.0/oauth/userCode",
        data: formUrlEncoded({ clientId: env.IFOOD_CLIENT_ID }),
      } as AxiosRequestConfig<CodeVerifierDto>);
      data = JSON.parse(data);
      console.log({ data });

      const ifood = await findOrCreate.execute();

      await this.ifoodRepository.update(ifood.id, {
        authorizationCodeVerifier: data.authorizationCodeVerifier,
      });

      shell.openExternal(data.verificationUrlComplete);
      return data;
    }
    throw new Error("Falha ao estabelecer conexão com internet");
  }
}

export const getCodeVerifier = new GetCodeVerifier();
