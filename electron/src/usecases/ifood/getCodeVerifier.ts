import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";

import { IfoodDto } from "../../models/gestor";

import ifoodApi from "../../providers/ifoodApi";
import env from "../../providers/env.json";
import { findOrCreate } from "./findOrCreate";

import { formUrlEncoded } from "../../helpers/formUrlEncoded";
import { CodeVerifierDto } from "./dtos/codeVerifier";

class GetCodeVerifier implements IUseCaseFactory {
  constructor(
    private ifoodRepository = new BaseRepository<IfoodDto>(StorageNames.Ifood)
  ) {}

  async execute(): Promise<CodeVerifierDto> {
    const hasInternet = await checkInternet();
    if (hasInternet) {
      const { data } = await ifoodApi.post<CodeVerifierDto>(
        "/authentication/v1.0/oauth/userCode",
        formUrlEncoded({ clientId: env.IFOOD_CLIENT_ID })
      );

      const ifood = await findOrCreate.execute();

      await this.ifoodRepository.update(ifood.id, {
        authorizationCodeVerifier: data.authorizationCodeVerifier,
      });

      return data;
    }
    throw new Error("Falha ao estabelecer conexão com internet");
  }
}

export const getCodeVerifier = new GetCodeVerifier();
