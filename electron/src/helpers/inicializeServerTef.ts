import { spawn } from 'child_process';
import path from 'path';

export function inicializeServerTef() {
    const pathExecute = path.join(process.env.LOCALAPPDATA as string, 'Programs', 'server-dll-tef', 'ServerTEF.exe');
    // Cria o processo filho para executar o executável
    const childProcess = spawn(pathExecute, [], { windowsHide: true });

    // Exibe o PID do processo filho
    console.log(`PID do processo filho: ${childProcess.pid}`);

    // Captura a saída do processo filho e exibe no console
    childProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    childProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    // Captura o evento de fechamento do processo filho
    childProcess.on('close', (code) => {
        console.log(`Processo filho terminou com o código ${code}`);
    });

    return childProcess

}

