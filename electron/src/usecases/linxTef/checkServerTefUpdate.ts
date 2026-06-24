import fs from "fs";
import {
  REQUIRED_SERVER_TEF_VERSION,
  SERVER_TEF_DOWNLOAD_URL,
} from "../../constants/serverTef";
import {
  getServerTefAsarPath,
  getServerTefInstalledVersion,
} from "../../helpers/getServerTefInstalledVersion";
import { shouldExecuteTask } from "../../helpers/shouldExecuteTask";
import { CheckServerTefUpdateDto } from "../../models/dtos/checkServerTefUpdate";
import { IUseCaseFactory } from "../useCaseFactory.interface";

const SHOULD_TEF_MESSAGE_VERSION_TASK = "should-tef-message-version";

class CheckServerTefUpdate implements IUseCaseFactory {
  async execute(): Promise<CheckServerTefUpdateDto> {
    const isEnabled = await shouldExecuteTask(SHOULD_TEF_MESSAGE_VERSION_TASK);
    const downloadUrl = SERVER_TEF_DOWNLOAD_URL;
    const requiredVersion = REQUIRED_SERVER_TEF_VERSION;

    const asarPath = getServerTefAsarPath();
    if (!asarPath || !fs.existsSync(asarPath)) {
      return {
        needsUpdate: false,
        currentVersion: null,
        requiredVersion,
        downloadUrl,
        message: "server-dll-tef não encontrado neste computador.",
      };
    }

    const installedVersion = getServerTefInstalledVersion();
    if (installedVersion === null) {
      return {
        needsUpdate: false,
        currentVersion: null,
        requiredVersion,
        downloadUrl,
        message: "Não foi possível ler a versão do server-dll-tef.",
      };
    }

    if (
      installedVersion !== REQUIRED_SERVER_TEF_VERSION &&
      isEnabled === true
    ) {
      return {
        needsUpdate: true,
        currentVersion: installedVersion,
        requiredVersion,
        downloadUrl,
        message: `Esperada: ${REQUIRED_SERVER_TEF_VERSION}. Encontrada: ${installedVersion}.`,
      };
    }

    return {
      needsUpdate: false,
      currentVersion: installedVersion,
      requiredVersion,
      downloadUrl,
      message: "server-dll-tef está atualizado.",
    };
  }
}

export const checkServerTefUpdate = new CheckServerTefUpdate();
