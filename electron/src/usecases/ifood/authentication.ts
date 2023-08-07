import moment from "moment";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import ifoodApi from "../../providers/ifoodApi";
import jwt_decode from "jwt-decode";
import env from "../../providers/env.json";
import { IfoodDto } from "../../models/gestor";

import { formUrlEncoded } from "../../helpers/formUrlEncoded";

import { findOrCreate } from "./findOrCreate";

class Authentication implements IUseCaseFactory {
  constructor(
    private ifoodRepository = new BaseRepository<IfoodDto>(StorageNames.Ifood)
  ) {}

  async execute(): Promise<IfoodDto> {
    const hasInternet = await checkInternet();
    if (hasInternet) {
      let ifood = await findOrCreate.execute();
      if (ifood.token && moment(new Date()).isBefore(ifood.token_expired_at)) {
        return ifood;
      } else {
        const { data } = await ifoodApi.post(
          "/authentication/v1.0/oauth/token",
          formUrlEncoded({
            clientId: env.IFOOD_CLIENT_ID,
            clientSecret: env.IFOOD_CLIENT_SECRET,
            grantType: ifood.refresh_token
              ? "refresh_token"
              : "authorization_code",
            authorizationCode: ifood.authorizationCode,
            authorizationCodeVerifier: ifood.authorizationCodeVerifier,
            refreshToken: ifood.refresh_token,
          }),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );
        ifood.token = data.accessToken;
        ifood.merchant_id = jwt_decode<{ merchant_scope }>(
          data.accessToken
        ).merchant_scope[0].split(":")[0];
        ifood.refresh_token = data.refreshToken;
        ifood.token_expired_at = moment(new Date())
          .add(5, "hours")
          .add(45, "minutes")
          .toDate();

        await this.ifoodRepository.update(ifood.id, ifood);

        return ifood;
      }
    } else {
      throw new Error("Aplicação sem conexão com internet");
    }
  }
}

export const authentication = new Authentication();
