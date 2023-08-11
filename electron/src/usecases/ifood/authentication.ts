import { ipcRenderer } from "electron";
import jwt_decode from "jwt-decode";
import moment from "moment";

import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";

import env from "../../providers/env.json";

import { IfoodDto } from "../../models/gestor";

import { formUrlEncoded } from "../../helpers/formUrlEncoded";

import { findOrCreate } from "./findOrCreate";
import { AxiosRequestConfig } from "axios";

class Authentication implements IUseCaseFactory {
  constructor(
    private ifoodRepository = new BaseRepository<IfoodDto>(StorageNames.Ifood)
  ) {}

  async execute(): Promise<{ response: IfoodDto; status: boolean }> {
    const hasInternet = await checkInternet();
    if (hasInternet) {
      let ifood = await findOrCreate.execute();
      console.log({
        isValid: moment(new Date()).isBefore(ifood.token_expired_at),
        data: moment(ifood.token_expired_at).format("DD/MM/YYYY HH:mm:ss")
      })
      if (ifood.token && moment(new Date()).isBefore(ifood.token_expired_at)) {
        return { response: ifood, status: true };
      } else {
        try {
          console.log(ifood.refresh_token
            ? "refresh_token"
            : "authorization_code")
          let data = await ipcRenderer.invoke("request-handler", {
            method: "POST",
            url: "https://merchant-api.ifood.com.br/authentication/v1.0/oauth/token",
            data: formUrlEncoded({
              clientId: env.IFOOD_CLIENT_ID,
              clientSecret: env.IFOOD_CLIENT_SECRET,
              grantType: ifood.refresh_token
                ? "refresh_token"
                : "authorization_code",
              authorizationCode: ifood.authorizationCode,
              authorizationCodeVerifier: ifood.authorizationCodeVerifier,
              refreshToken: ifood.refresh_token,
            }),
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          } as AxiosRequestConfig);
          data = JSON.parse(data);

          ifood.token = data.accessToken;
          ifood.merchant_id = jwt_decode<{ merchant_scope }>(
            data.accessToken
          ).merchant_scope[0].split(":")[0];
          ifood.refresh_token = data.refreshToken;
          ifood.token_expired_at = moment(new Date())
            .add(2, "hours")
            .add(45, "minutes")
            .toDate();

          await this.ifoodRepository.update(ifood.id, ifood);

          return { response: ifood, status: true };
        } catch (error: any) {
          if (error?.message?.includes("401")) {
            const updatedIfood = (await this.ifoodRepository.update(ifood.id, {
              token: undefined,
              token_expired_at: undefined,
              refresh_token: undefined,
              authorizationCode: undefined,
              authorizationCodeVerifier: undefined,
            })) as IfoodDto;

            return { response: updatedIfood, status: false };
          }
          throw new Error(error);
        }
      }
    } else {
      throw new Error("Aplicação sem conexão com internet");
    }
  }
}

export const authentication = new Authentication();
