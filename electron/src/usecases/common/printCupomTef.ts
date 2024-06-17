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
            const { response: folderPath, has_internal_error, error_message } =
                await useCaseFactory.execute<string>(this.getPahCupomUseCase);

            if (has_internal_error) {
                throw new Error(error_message || 'Erro ao tentar buscar o caminho de impressão do cupons')
            }

            if (!folderPath) {
                throw new Error('Caminho da pasta de cupons não encontrado.')
            }

            let files = fs.readdirSync(folderPath);

            if (files.length === 0) {
                throw new Error("Não foi encontrado nenhum cupom na pasta")
            }

            files.sort((a, b) => {
                const aStats = fs.statSync(path.join(folderPath, a));
                const bStats = fs.statSync(path.join(folderPath, b));
                return bStats.mtime.getTime() - aStats.mtime.getTime();
            });
            console.log(files, 'filess')
            for (const file of files) {
                const filePath = path.join(folderPath, file);
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
            }
        } catch (error) {
            console.error('Erro ao imprimir os arquivos:', error);
        }
    }
}

export const printFileContent = new PrintFileContent();
