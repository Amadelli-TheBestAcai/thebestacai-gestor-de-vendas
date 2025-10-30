import fs from "fs";
import path from "path";
import os from "os";

interface IGestorTefLogData {
    Payload?: Record<string, any>;
    Response?: Record<string, any> | null;
    Sale?: Record<string, any> | null;
    Settings?: Record<string, any> | null; // 👈 novo campo
    MessageError?: string | null;
    IsConnectInternet?: boolean;
    TurnOffTef?: boolean;
    tempoTotalMs?: number;
}

/**
 * Função global para salvar logs das transações TEF do Gestor.
 *
 * - Salva em: AppData\Roaming\logsGestorTef
 * - Agrupa logs por dia
 * - Inclui Payload, Response, Sale, Settings, erros e tempo total
 */
export function writeGestorTefLog(
    tipoTransacao: string,
    data: IGestorTefLogData = {}
): void {
    try {
        // Caminho base no AppData\Roaming
        const appDataPath = path.join(
            os.homedir(),
            "AppData",
            "Roaming",
            "logsGestorTef"
        );

        if (!fs.existsSync(appDataPath)) {
            fs.mkdirSync(appDataPath, { recursive: true });
        }

        // Nome do arquivo baseado no dia (YYYY-MM-DD)
        const dateNow = new Date();
        const dateStr = dateNow.toISOString().split("T")[0];
        const logFilePath = path.join(appDataPath, `logs-${dateStr}.txt`);

        // Monta o conteúdo do log
        let logContent = "";
        logContent += `Transação Gestor: ${tipoTransacao}\n`;
        logContent += `Data: ${dateNow.toLocaleString()}\n\n`;

        if (data.Payload) {
            logContent += `Payload:\n${JSON.stringify(data.Payload, null, 2)}\n\n`;
        }

        if (data.IsConnectInternet !== undefined) {
            logContent += `Is Connect Internet: ${data.IsConnectInternet}\n\n`;
        }

        if (data.TurnOffTef !== undefined) {
            logContent += `Turn Off TEF: ${data.TurnOffTef}\n\n`;
        }

        if (data.Response) {
            logContent += `Response:\n${JSON.stringify(data.Response, null, 2)}\n\n`;
        }

        if (data.Sale) {
            logContent += `Sale:\n${JSON.stringify(data.Sale, null, 2)}\n\n`;
        }

        if (data.Settings) {
            logContent += `Settings:\n${JSON.stringify(data.Settings, null, 2)}\n\n`;
        }

        if (data.MessageError) {
            logContent += `Message Error:\n${data.MessageError}\n\n`;
        }

        if (data.tempoTotalMs) {
            logContent += `Tempo total da requisição: ${data.tempoTotalMs} ms\n\n`;
        }

        logContent += `--------------------------------------------------------------\n\n`;

        // Escreve (append) no arquivo do dia
        fs.appendFileSync(logFilePath, logContent, "utf-8");

        console.log(`🧾 Log Gestor TEF (${tipoTransacao}) salvo em: ${logFilePath}`);
    } catch (error) {
        console.error("❌ Erro ao salvar log Gestor TEF:", error);
    }
}
