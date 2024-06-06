import axios from 'axios';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import path from 'path';

let serverTefProcess: ChildProcessWithoutNullStreams | null = null;

async function isServerTefRunning() {
    try {
        const response = await axios.get('http://localhost:7788/healthz');
        return response.status !== 404;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            return false;
        }
        return false;
    }
}

export async function inicializeServerTef() {
    if (await isServerTefRunning()) {
        console.log('ServerTEF já está rodando.');
        return serverTefProcess;
    }

    const pathExecute = path.join(
        process.env.LOCALAPPDATA as string, 'Programs', 'server-dll-tef', 'ServerTEF.exe');
    // Cria o processo filho para executar o executável
    serverTefProcess = spawn(pathExecute, [], { windowsHide: true });

    // Exibe o PID do processo filho
    console.log(`PID do processo filho: ${serverTefProcess.pid}`);

    // Captura a saída do processo filho e exibe no console
    serverTefProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    serverTefProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    // Captura o evento de fechamento do processo filho
    serverTefProcess.on('close', (code) => {
        console.log(`Processo filho terminou com o código ${code}`);
        serverTefProcess = null; // Resetar a variável quando o processo terminar
    });

    return serverTefProcess;
}
