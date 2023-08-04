import moment from "moment";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { checkInternet } from "../../providers/internetConnection";
import ifoodApi from "../../providers/ifoodApi";
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
            authorizationCode: "VNHR-LZCW",
            authorizationCodeVerifier:
              "pron1x9lj6zp3wz6ajrzymp65ug7mcaaagg5owu3igzq9evudvjup2fmbcsipyqrcmi6heujznli7t6pqvooe7q269v4783mvw6",
            refreshToken: ifood.refresh_token,
          }),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        ifood.token = data.accessToken;
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
