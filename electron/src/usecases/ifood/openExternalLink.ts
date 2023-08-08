import { shell } from 'electron';
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { checkInternet } from "../../providers/internetConnection";

import ifoodApi from "../../providers/ifoodApi";

class OpenExternalLink implements IUseCaseFactory {

    async execute(): Promise<void> {
        const hasInternet = await checkInternet();
        if (hasInternet) {
            shell.openExternal('https://www.google.com.br');
        }
    }
}

export const openExternalLink = new OpenExternalLink();
