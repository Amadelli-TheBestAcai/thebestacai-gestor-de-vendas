import moment from "moment";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import ifoodApi from "../../providers/ifoodApi";
import jwt_decode from "jwt-decode";

import { formUrlEncoded } from "../../helpers/formUrlEncoded";

import { IfoodDto } from "../../models/gestor/ifood";

class Authentication implements IUseCaseFactory {
  constructor(
    private storeRepository = new BaseRepository<any>(StorageNames.Store)
  ) {}

  async execute(ifood: IfoodDto): Promise<IfoodDto> {
    const hasInternet = await checkInternet();
    if (hasInternet) {
      if (ifood.token && moment(new Date()).isAfter(ifood.token_expired_at)) {
        return ifood;
      } else {
        const { data } = await ifoodApi.post(
          "/authentication/v1.0/oauth/token",
          formUrlEncoded({
            clientId: `c29bd29d-9c18-497f-9994-2d271ea69af8`,
            clientSecret: `gl8eo8rhy6y613133uvllrfynll5i9mt51fasdzfj3sxxvt3jz7oumtf1xetj052dn1o5lop8412r88stucnwoc2yzkyvhlx7tz`,
            grantType: ifood.refresh_token
              ? "refresh_token"
              : "authorization_code",
            authorizationCode: "CBRM-PPGQ",
            authorizationCodeVerifier:
              "im36zr6dabnd7i169pqjg0w89wavvt85dpd0lfko2pz255xpbtfnpz6odgfssnluz2pzary79s7lrpxizwp3gxr4ffxlrggb093",
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

        return ifood;
      }
    } else {
      throw new Error("Aplicação sem conexão com internet");
    }
  }
}

export const authentication = new Authentication();
