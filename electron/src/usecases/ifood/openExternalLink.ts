import { shell } from 'electron';
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { checkInternet } from "../../providers/internetConnection";

import ifoodApi from "../../providers/ifoodApi";

class OpenExternalLink implements IUseCaseFactory {

    async execute(link: string): Promise<void> {
        const hasInternet = await checkInternet();
        if (hasInternet) {
            shell.openExternal(link);
        }
    }
}

export const openExternalLink = new OpenExternalLink();
