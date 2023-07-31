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

  const data = {
    logomarca: document.querySelector("#logomarca img").getAttribute("src"),
    dados_da_empresa: Array.from(
      document.querySelectorAll("#dados-da-empresa td")
    ).map((td: any) => td.textContent.trim()),
    documento_auxiliar: Array.from(
      document.querySelectorAll("#documento-auxiliar td")
    ).map((td: any) => td.textContent.trim()),
    lista_produtos: Array.from(
      document.querySelectorAll("#lista-produtos td")
    ).map((td: any) => td.textContent.trim()),
    valor_total: Array.from(document.querySelectorAll("#valor-total td")).map(
      (td: any) => td.textContent.trim()
    ),
    forma_pagamento: Array.from(
      document.querySelectorAll("#forma-pagamento td")
    ).map((td: any) => td.textContent.trim()),
    tributacao: Array.from(document.querySelectorAll("#tributacao td")).map(
      (td: any) => td.textContent.trim()
    ),
    info_adicionais: Array.from(
      document.querySelectorAll("#info-adicionais td")
    ).map((td: any) => td.textContent.trim()),
    homologacao: Array.from(document.querySelectorAll("#homologacao td")).map(
      (td: any) => td.textContent.trim()
    ),
    consumidor: Array.from(document.querySelectorAll("#consumidor td")).map(
      (td: any) => td.textContent.trim()
    ),
    qrcode: [
      document.querySelector("#qrcode span").textContent.trim(),
      htmlContent.split(`text: "`)[1].split(`"`)[0],
      "Protocolo de autorização:  " +
        htmlContent.split(`Protocolo de autorização: `)[1].split("<")[0],
    ],
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
    content.dados_da_empresa.forEach((info) =>
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
    while (count <= content.lista_produtos.length - 6) {
      this.printerFormater.tableCustom([
        {
          text: content.lista_produtos[count],
          align: "LEFT",
          cols: 5,
        },
        {
          text: content.lista_produtos[count + 1],
          align: "CENTER",
          cols: 10,
        },
        {
          text: content.lista_produtos[count + 2],
          align: "CENTER",
          cols: 10,
        },
        {
          text: content.lista_produtos[count + 3],
          align: "CENTER",
          cols: 5,
        },
        {
          text: content.lista_produtos[count + 4],
          align: "CENTER",
          cols: 10,
        },
        {
          text: content.lista_produtos[count + 5],
          align: "CENTER",
          cols: 10,
        },
      ]);
      count += 6;
    }
    this.printerFormater.drawLine();

    this.printerFormater.tableCustom([
      {
        text: content.valor_total[0],
        align: "LEFT",
        cols: 25,
      },
      {
        text: content.valor_total[1],
        align: "RIGHT",
        cols: 20,
      },
    ]);
    this.printerFormater.tableCustom([
      {
        text: content.valor_total[2],
        align: "LEFT",
        cols: 25,
      },
      {
        text: content.valor_total[3],
        align: "RIGHT",
        cols: 20,
      },
    ]);

    count = 0;
    while (count <= content.forma_pagamento.length - 2) {
      this.printerFormater.tableCustom([
        {
          text: content.forma_pagamento[count],
          align: "LEFT",
          cols: 25,
        },
        {
          text: content.forma_pagamento[count + 1],
          align: "RIGHT",
          cols: 20,
        },
      ]);
      count += 2;
    }

    this.printerFormater.drawLine();

    this.printerFormater.tableCustom([
      {
        text: content.tributacao[0],
        align: "LEFT",
        cols: 25,
      },
      {
        text: content.tributacao[1],
        align: "RIGHT",
        cols: 20,
      },
    ]);

    this.printerFormater.drawLine();

    this.printerFormater.println(content.tributacao[0]);

    this.printerFormater.drawLine();

    this.printerFormater.alignCenter();
    content.homologacao.forEach((info) => this.printerFormater.println(info));

    this.printerFormater.drawLine();

    this.printerFormater.alignCenter();
    content.consumidor.forEach((info) => this.printerFormater.println(info));

    this.printerFormater.drawLine();

    this.printerFormater.alignCenter();
    this.printerFormater.println(content.qrcode[0]);
    this.printerFormater.printQR(content.qrcode[1], {
      correction: "M",
      cellSize: 7,
    });
    this.printerFormater.println(content.qrcode[2]);

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
        console.log(err);
      },
    });
  }
}

export const printDanfe = new PrintDanfe();
