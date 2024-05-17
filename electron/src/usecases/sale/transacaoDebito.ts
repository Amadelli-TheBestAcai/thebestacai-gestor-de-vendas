import { IUseCaseFactory } from "../useCaseFactory.interface";
const { fork } = require('child_process');

class TransacaoCartaoDebito implements IUseCaseFactory {
    async execute(value: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const node32Path = 'C:\\Program Files\\nodejs\\node32.exe';
            const childProcess = fork('C:\\testLinxTEF\\TransacaoDebito.js', [value], {
                execPath: node32Path,
            });

            // Evento para lidar com a mensagem recebida do processo filho
            childProcess.on('message', (message) => {
                console.log('Retorno do processo filho:', message);
                resolve(message); // Resolva a promessa com a mensagem recebida
            });

            // Evento para lidar com erros no processo filho
            childProcess.on('error', (error) => {
                console.error('Erro no processo filho:', error);
                reject(error); // Rejeite a promessa com o erro
            });
        });
    }
}

export const transacaoCartaoDebito = new TransacaoCartaoDebito();
