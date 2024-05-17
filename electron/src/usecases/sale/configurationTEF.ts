import { IUseCaseFactory } from "../useCaseFactory.interface";
const { fork } = require('child_process');
const path = require('path')


class ConfigurationTEF implements IUseCaseFactory {
    async execute(): Promise<any> {
        const node32Path = 'C:\\Program Files\\nodejs\\node32.exe';

        const options = {
            execPath: node32Path,
            windowsHide: true, // Esconder a janela do terminal no Windows
            shell: true, // Usar um shell para executar o processo no Windows
            runas: true // Executar como administrador no Windows
        };
        fork('C:\\testLinxTEF\\ConfiguraCNPJEstabelecimento.js', [], options);
        fork('C:\\testLinxTEF\\ConfiguraEmpresaLojaPDV.js', [], options);
        fork('C:\\testLinxTEF\\ConfiguraComunicacaoDTEF.js', [], options);
        fork('C:\\testLinxTEF\\BuscaCertificado.js', [], options);
    }
}
export const configurationTEF = new ConfigurationTEF();
