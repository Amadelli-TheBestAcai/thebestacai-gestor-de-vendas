import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { SettingsDto } from "../../models/gestor";
import {
    printer as ThermalPrinter,
    types as TermalTypes,
} from 'node-thermal-printer';
import Printer from 'printer';

interface Request {
    html: any;
}

class PrintNfceSale implements IUseCaseFactory {
    printerFormater: ThermalPrinter;
    constructor(
        private settingsRepository = new BaseRepository<SettingsDto>(StorageNames.Settings)
    ) {
        this.printerFormater = new ThermalPrinter({
            type: TermalTypes.EPSON,
            interface: 'tcp://xxx.xxx.xxx.xxx',
            characterSet: 'SLOVENIA',
            removeSpecialCharacters: false,
            width: 72,
            lineCharacter: '=',
            options: {
                timeout: 5000,
            },
        });
    }

    async execute({ html }: Request): Promise<void> {
        const settings = await this.settingsRepository.getOne();
        const printer = settings?.printer;

        if (!settings?.should_use_printer) {
            return;
        }

        const termalPrinter = Printer.getPrinter(printer);

        this.printerFormater.clear();
        this.printerFormater.cut();

        const buffer = Buffer.from(html, 'utf-8');
        Printer.printDirect({
            data: buffer,
            options: termalPrinter.options,
            printer,
            type: 'RAW',
            success: function () {
                console.log('printed with success');
            },
            error: function (err) {
                console.log(err);
            },
        });
    }
}

export const printNfceSale = new PrintNfceSale();