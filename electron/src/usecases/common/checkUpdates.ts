import { IUseCaseFactory } from "../useCaseFactory.interface";
import { checkInternet } from "../../providers/internetConnection";
import odinApi from "../../providers/odinApi";

class CheckUpdates implements IUseCaseFactory {
  async execute({
    pkg_version,
  }): Promise<{ has_update: boolean; is_mandatory: boolean }> {
    const hasInternet = await checkInternet();
    if (hasInternet) {
      const {
        data: {
          data: { version },
        },
      } = await odinApi.get("/version?app=gestor_2_0");

      const server = {
        version,
        high_priority: version.split(".")[0],
      };

      const local = {
        version: pkg_version,
        high_priority: pkg_version.split(".")[0],
      };

      console.log({
        message: "Verificação da versão do sistema",
        response: {
          server,
          local,
        },
      });

      return {
        has_update: server.version !== local.version,
        is_mandatory: server.high_priority !== local.high_priority,
      };
    } else {
      return {
        has_update: false,
        is_mandatory: false,
      };
    }
  }
}

export const checkUpdates = new CheckUpdates();
