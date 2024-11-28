import fs from 'fs';

export const readFileContent = (filePath: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err: NodeJS.ErrnoException | null, data: string) => {
            if (err) {
                reject(`Erro ao ler o arquivo: ${err.message}`);
            } else {
                resolve(data);
            }
        });
    });
};
