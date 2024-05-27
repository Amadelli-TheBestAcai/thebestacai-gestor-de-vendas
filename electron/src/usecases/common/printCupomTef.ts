import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { SettingsDto } from "../../models/gestor";
import {
    printer as ThermalPrinter,
    types as ThermalTypes,
} from 'node-thermal-printer';
import Printer from 'printer';
import { readFileContent } from "../../helpers/readFileTxt";

class PrintFileContent implements IUseCaseFactory {
    printerFormater: ThermalPrinter;
    constructor(
        private settingsRepository = new BaseRepository<SettingsDto>(StorageNames.Settings)
    ) {
        this.printerFormater = new ThermalPrinter({
            type: ThermalTypes.EPSON,
            interface: 'tcp://xxx.xxx.xxx.xxx',
            characterSet: 'SLOVENIA',
            removeSpecialCharacters: false,
            lineCharacter: '=',
            options: {
                timeout: 5000,
            },
        });
    }

    async execute(): Promise<any> {
        const settings = await this.settingsRepository.getOne();

        const printer = settings?.printer;

        if (!settings?.should_use_printer) {
            return;
        }

        const termalPrinter = Printer.getPrinter(printer);

        try {
            const filePath = 'C:\\Users\\lucas\\Documents\\Amatech\\REDECARD.txt'
            const fileContent = await readFileContent(filePath);

            this.printerFormater.clear();
            this.printerFormater.println(fileContent)

            const lines = fileContent.split('\n');

            this.printerFormater.clear();

            for (const line of lines) {
                this.printerFormater.println(line.trim());

                if (line.trim().startsWith("(NSU D-TEF")) {
                    this.printerFormater.cut();
                }
            }

            Printer.printDirect({
                data: this.printerFormater.getBuffer(),
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
        } catch (error) {
            console.error('Erro ao imprimir o arquivo:', error);
        }
    }
}

export const printFileContent = new PrintFileContent();
