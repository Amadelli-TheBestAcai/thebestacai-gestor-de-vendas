## Ferramentas necessárias

Antes da inicialização e instação do projeto, é necessário instalar as ferramentas:

```bash
npm install --global --production windows-build-tools@4.0.0
```

```bash
npm install --global node-gyp@latest
```

```bash
npm config set python python2.7
```

```bash
npm config set msvs_version 2019
```

- [Build Tools for Visual Studio 2022 - Click para download](https://aka.ms/vs/17/release/vs_BuildTools.exe) - [Clique para entrar no site](https://visualstudio.microsoft.com/downloads/)

Com o Build Tools deverá instalar as ferramentas:

**Desenvolvimento para desktop com C++** e **Ferramentas de build do Node.js**

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
  "NFCe_Token": "${NFCe_Token}",
  "NFCe_AMBIENTE": ${NFCe_AMBIENTE},
  "API_LOG": "${API_LOG}",
  "API_AUTH": "${API_AUTH}",
  "CHAT_DASH": "${CHAT_DASH}",
  "API_SALES_HANDLER": "${API_SALES_HANDLER}"
}
```

**Observação:** Apenas o valor ${\*} deverá ser alterado, não adicionando " " na substituição.

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

**dica**: mudanças feitas na pasta **electron** não atualizam sozinhas ao salvar, pra ser mais rapido, pode só parar o terminal que esta usando o comando **yarn dev:electron** e executar novamente.
