## Ferramentas necessárias.

Antes da inicialização e instação do projeto, é necessário instalar as ferramentas na platarforma **Windows**, no **Power Shell** em modo **Administrador** e em ordem:

**1-**

```bash
npm install -g yarn
```

**2-**

```bash
npm install --global --production windows-build-tools@4.0.0
```

**3-**

```bash
npm install --global node-gyp@latest
```

**4-**

- [Python 3.11.12 - Click para download](https://www.python.org/ftp/python/3.11.2/python-3.11.2-amd64.exe)

**5-**

```bash
npm config set python python2.7
```

**6-**

- [Build Tools for Visual Studio 2017 - Click para download](https://my.visualstudio.com/Downloads?q=visual%20studio%202017&wt.mc_id=o~msft~vscom~older-downloads)

Com o Build Tools deverá instalar as ferramentas:

**Desenvolvimento para desktop com C++** e **Ferramentas de build do Node.js**

**7-**

```bash
npm config set msvs_version 2017
```

**8-**

```bash
yarn install --network-timeout 600000
```

###### Após instalações

Criar arquivo como na estrutura abaixo

```bash
-> electron
  -> src
    -> providers
      -> env.json
```

O conteúdo do arquivo **env.json** deverá conster as sequintes informações:

```bash
{
  "API_DASH": "${API_DASH}",
  "API_AUTH": "${API_AUTH}",
  "CHAT_DASH": "${CHAT_DASH}",
  "API_SALES_HANDLER": "${API_SALES_HANDLER}",
  "API_MERCURY": "${API_MERCURY}",
  "NPS_URL": "${NPS_URL}",
  "DASH_THOR": "${DASH_THOR}",
  "API_THOR": "${API_THOR}",
  "TOKEN_SECRET_NPS": "${TOKEN_SECRET_NPS}",
  "NPS_URL": "${NPS_URL}",
  "API_S3": "${API_S3}",
  "IFOOD_CLIENT_ID": "${IFOOD_CLIENT_ID}",
  "IFOOD_CLIENT_SECRET": "${IFOOD_CLIENT_SECRET}"
}
```

**Observação:** Apenas o valor ${\*} deverá ser alterado, não adicionando " " na substituição

## Executando Aplicação

Abrir dois terminais e:

Executar no primeiro:

```bash
yarn dev:react
```

Após o primeiro finalizar a subida do frontend, executar:

```bash
yarn dev:electron
```

**dica**: mudanças feitas na pasta **electron** não refletem na aplicação ao salvar, para ser mais eficiente, pode apenas parar o terminal que esta usando o comando **yarn dev:electron** e executar novamente.
