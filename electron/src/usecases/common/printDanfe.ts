import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { StoreDto, SettingsDto } from "../../models/gestor";
import {
  printer as ThermalPrinter,
  types as TermalTypes,
} from "node-thermal-printer";
import Printer from "printer";
import { ipcRenderer } from "electron";
import { replaceSpecialChars } from "../../helpers/replaceSpecialChars";
import { JSDOM } from "jsdom";

function extractDataFromHTML(htmlContent) {
  const { window } = new JSDOM(htmlContent);
  const { document } = window;

  let data;

  const logomarca_temp = document.querySelector(".logomarca img")
    ? document.querySelector(".logomarca img").getAttribute("src")
    : "";

  const dados_da_empresa_temp = document.querySelectorAll(
    ".dados-da-empresa td"
  )
    ? Array.from(document.querySelectorAll(".dados-da-empresa td")).map(
        (td: any) => td?.textContent?.trim()
      )
    : "";

  const documento_auxiliar_temp = document.querySelectorAll(
    ".documento-auxiliar td"
  )
    ? Array.from(document.querySelectorAll(".documento-auxiliar td")).map(
        (td: any) => td?.textContent?.trim()
      )
    : "";

  const lista_produtos_temp = document.querySelectorAll(".lista-produtos td")
    ? Array.from(document.querySelectorAll(".lista-produtos td")).map(
        (td: any) => td?.textContent?.trim()
      )
    : "";

  const valor_total_temp = document.querySelectorAll(".valor-total td")
    ? Array.from(document.querySelectorAll(".valor-total td")).map((td: any) =>
        td?.textContent?.trim()
      )
    : "";

  const forma_pagamento_temp = document.querySelectorAll(".forma-pagamento td")
    ? Array.from(document.querySelectorAll(".forma-pagamento td")).map(
        (td: any) => td?.textContent?.trim()
      )
    : "";

  const tributacao_temp = document.querySelectorAll(".tributacao td")
    ? Array.from(document.querySelectorAll(".tributacao td")).map((td: any) =>
        td?.textContent?.trim()
      )
    : "";

  const info_adicionais_temp = document.querySelectorAll(".info-adicionais td")
    ? Array.from(document.querySelectorAll(".info-adicionais td")).map(
        (td: any) => td?.textContent?.trim()
      )
    : "";

  const homologacao_temp = document.querySelectorAll(".homologacao td")
    ? Array.from(document.querySelectorAll(".homologacao td")).map((td: any) =>
        td?.textContent?.trim()
      )
    : "";

  const consumidor_temp = document.querySelectorAll(".consumidor td")
    ? Array.from(document.querySelectorAll(".consumidor td")).map((td: any) =>
        td?.textContent?.trim()
      )
    : "";

  const qrcode_temp = document.querySelector(".qrcode span")
    ? [
        document.querySelector(".qrcode span").textContent?.trim(),
        htmlContent?.split(`text: "`)[1]?.split(`"`)[0],
        "Protocolo de autorização:  " +
          htmlContent?.split(`Protocolo de autorização: `)[1]?.split("<")[0],
      ]
    : "";

  data = {
    ...data,
    logomarca: logomarca_temp,
    dados_da_empresa: dados_da_empresa_temp,
    documento_auxiliar: documento_auxiliar_temp,
    lista_produtos: lista_produtos_temp,
    valor_total: valor_total_temp,
    forma_pagamento: forma_pagamento_temp,
    tributacao: tributacao_temp,
    info_adicionais: info_adicionais_temp,
    homologacao: homologacao_temp,
    consumidor: consumidor_temp,
    qrcode: qrcode_temp,
  };

  return data;
}

interface Request {
  payload;
}

class PrintDanfe implements IUseCaseFactory {
  printerFormater: ThermalPrinter;
  constructor(
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store),
    private settingsRepository = new BaseRepository<SettingsDto>(
      StorageNames.Settings
    )
  ) {
    this.printerFormater = new ThermalPrinter({
      type: TermalTypes.EPSON,
      interface: "tcp://xxx.xxx.xxx.xxx",
      characterSet: "SLOVENIA",
      removeSpecialCharacters: false,
      lineCharacter: "-",
      options: {
        timeout: 5000,
      },
    });
  }

  async execute({ payload }: Request): Promise<void> {
    const settings = await this.settingsRepository.getOne();

    if (!settings?.should_use_printer) {
      return;
    }

    const printer = settings?.printer;

    const html = await ipcRenderer.invoke("get-danfe", payload);

    const content = extractDataFromHTML(html);

    const termalPrinter = Printer.getPrinter(printer);

    this.printerFormater.clear();

    this.printerFormater.alignLeft();
    content?.dados_da_empresa.forEach((info) =>
      this.printerFormater.println(info)
    );

    this.printerFormater.alignCenter();
    this.printerFormater.println("DANFE NFC-e Documento Auxiliar");
    this.printerFormater.println("da Nota Fiscal ao Consumidor Eletrônica");

    this.printerFormater.drawLine();

    this.printerFormater.tableCustom([
      { text: "Cód.", align: "LEFT", cols: 5 },
      { text: "Descrição", align: "CENTER", cols: 10 },
      { text: "Qtd.", align: "CENTER", cols: 10 },
      { text: "Un", align: "CENTER", cols: 5 },
      { text: "Vl. Unit", align: "CENTER", cols: 10 },
      { text: "Vl. Total", align: "CENTER", cols: 10 },
    ]);

    let count = 0;
    while (count <= content?.lista_produtos.length - 6) {
      this.printerFormater.tableCustom([
        {
          text: content?.lista_produtos[count],
          align: "LEFT",
          cols: 5,
        },
        {
          text: content?.lista_produtos[count + 1],
          align: "CENTER",
          cols: 10,
        },
        {
          text: content?.lista_produtos[count + 2],
          align: "CENTER",
          cols: 10,
        },
        {
          text: content?.lista_produtos[count + 3],
          align: "CENTER",
          cols: 5,
        },
        {
          text: content?.lista_produtos[count + 4],
          align: "CENTER",
          cols: 10,
        },
        {
          text: content?.lista_produtos[count + 5],
          align: "CENTER",
          cols: 10,
        },
      ]);
      count += 6;
    }
    this.printerFormater.drawLine();

    this.printerFormater.tableCustom([
      {
        text: content?.valor_total[0],
        align: "LEFT",
        cols: 25,
      },
      {
        text: content?.valor_total[1],
        align: "RIGHT",
        cols: 20,
      },
    ]);
    this.printerFormater.tableCustom([
      {
        text: content?.valor_total[2],
        align: "LEFT",
        cols: 25,
      },
      {
        text: content?.valor_total[3],
        align: "RIGHT",
        cols: 20,
      },
    ]);
    if (content?.valor_total[4]) {
      this.printerFormater.tableCustom([
        {
          text: content.valor_total[4] || "",
          align: "LEFT",
          cols: 25,
        },
        {
          text: content.valor_total[5] || "",
          align: "RIGHT",
          cols: 20,
        },
      ]);
    }
    if (content?.valor_total[6]) {
      this.printerFormater.tableCustom([
        {
          text: content?.valor_total[6] || "",
          align: "LEFT",
          cols: 25,
        },
        {
          text: content?.valor_total[7] || "",
          align: "RIGHT",
          cols: 20,
        },
      ]);
    }

    count = 0;
    while (count <= content?.forma_pagamento.length - 2) {
      this.printerFormater.tableCustom([
        {
          text: content?.forma_pagamento[count],
          align: "LEFT",
          cols: 25,
        },
        {
          text: content?.forma_pagamento[count + 1],
          align: "RIGHT",
          cols: 20,
        },
      ]);
      count += 2;
    }

    this.printerFormater.drawLine();

    this.printerFormater.tableCustom([
      {
        text: content?.tributacao[0],
        align: "LEFT",
        cols: 25,
      },
      {
        text: content?.tributacao[1],
        align: "RIGHT",
        cols: 20,
      },
    ]);

    this.printerFormater.drawLine();

    this.printerFormater.alignCenter();
    content?.homologacao.forEach((info) => this.printerFormater.println(info));

    this.printerFormater.drawLine();

    this.printerFormater.alignCenter();
    content?.consumidor.forEach((info) => this.printerFormater.println(info));

    this.printerFormater.drawLine();

    this.printerFormater.alignCenter();
    this.printerFormater.println(content?.qrcode[0]);
    this.printerFormater.printQR(content?.qrcode[1], {
      correction: "M",
      cellSize: 7,
    });
    this.printerFormater.println(content?.qrcode[2]);

    this.printerFormater.cut();

    Printer.printDirect({
      data: this.printerFormater.getBuffer(),
      options: termalPrinter.options,
      printer,
      type: "RAW",
      success: function () {
        console.log("printed with success");
      },
      error: function (err) {
        console.log(err, "error");
      },
    });
  }
}

export const printDanfe = new PrintDanfe();
