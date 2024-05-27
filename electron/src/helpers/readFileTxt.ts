import fs from 'fs';

export const readFileContent = (filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject('Erro ao ler o arquivo: ' + err);
            } else {
                resolve(data);
            }
        });
    });
};
