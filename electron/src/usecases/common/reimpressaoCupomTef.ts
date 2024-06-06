import fs from 'fs';
import path from 'path';
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
import { getPathCupom } from '../linxTef';
import { useCaseFactory } from '../useCaseFactory';

class PrintFileContent implements IUseCaseFactory {
    printerFormater: ThermalPrinter;
    constructor(
        private settingsRepository = new BaseRepository<SettingsDto>(StorageNames.Settings),
        private getPahCupomUseCase = getPathCupom
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
            const { response: folderPath } =
                await useCaseFactory.execute<string>(this.getPahCupomUseCase);
            console.log(folderPath)

            if (!folderPath) {
                console.error('Caminho da pasta não encontrado.');
                return;
            }

            let files = fs.readdirSync(folderPath);

            // files = files.filter(file => path.extname(file).toLowerCase() === '.txt');

            if (files.length === 0) {
                console.error('Nenhum arquivo encontrado na pasta.');
                return;
            }

            // Opcional: Ordenar os arquivos por data de modificação (mais recente primeiro)
            files.sort((a, b) => {
                const aStats = fs.statSync(path.join(folderPath, a));
                const bStats = fs.statSync(path.join(folderPath, b));
                return bStats.mtime.getTime() - aStats.mtime.getTime();
            });

            // Selecionar o arquivo mais recente
            const latestFile = files[0];
            const filePath = path.join(folderPath, latestFile);

            console.log(`Lendo o arquivo: ${filePath}`);
            const fileContent = await readFileContent(filePath);

            this.printerFormater.clear();
            this.printerFormater.println(fileContent);

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
                    console.log('Impressão realizada com sucesso');
                },
                error: function (err) {
                    console.error('Erro na impressão:', err);
                },
            });
        } catch (error) {
            console.error('Erro ao imprimir o arquivo:', error);
        }
    }
}

export const printFileContent = new PrintFileContent();
