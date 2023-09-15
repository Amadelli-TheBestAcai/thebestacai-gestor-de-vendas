import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { StoreDto, SettingsDto } from "../../models/gestor";
import { SaleFromApiDTO } from "../../models/dtos/salesFromApi";
import { SaleDto } from "../../models/gestor/sale";
import { replaceSpecialChars } from "../../helpers/replaceSpecialChars";
import * as jwt from "jsonwebtoken";
import env from "../../providers/env.json";
import moment from "moment";
import {
  printer as ThermalPrinter,
  types as TermalTypes,
} from "node-thermal-printer";
import Printer from "printer";
import axios from "axios";

interface Request {
  sale: SaleFromApiDTO | SaleDto;
}

class PrintSale implements IUseCaseFactory {
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
      lineCharacter: "=",
      options: {
        timeout: 5000,
      },
    });
  }

  async execute({ sale }: Request): Promise<void> {
    const store = await this.storeRepository.getOne();
    const settings = await this.settingsRepository.getOne();

    const printer = settings?.printer;

    const created_at = moment(sale.created_at)
      .parseZone()
      .format("YYYY-MM-DDTHH:mm:ss");
    const expirationDate = moment(created_at)
      .add(1, "day")
      .format("DD/MM/YYYY HH:mm:ss");

    if (!settings?.should_use_printer) {
      return;
    }

    const termalPrinter = Printer.getPrinter(printer);

    this.printerFormater.clear();

    this.printerFormater.alignCenter();
    this.printerFormater.println(
      `THE BEST ACAI: ${replaceSpecialChars(store?.company.company_name || "")}`
    );
    this.printerFormater.println(
      `CNPJ: ${store?.company.cnpj.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
      )}`
    );
    this.printerFormater.println(
      `${store?.company.address}, ${store?.company.number}`
    );
    this.printerFormater.println(
      `${store?.company.city}, ${store?.company.state_registration}, ${store?.company.cep}`
    );
    this.printerFormater.alignLeft();

    this.printerFormater.drawLine();
    this.printerFormater.alignCenter();
    this.printerFormater.println(
      "Documento Auxiliar da Nota Fiscal Eletrônica"
    );
    this.printerFormater.println("Consumidor Final");
    this.printerFormater.alignLeft();

    this.printerFormater.drawLine();
    this.printerFormater.alignCenter();
    this.printerFormater.println("Detalhe da venda");
    this.printerFormater.alignLeft();
    this.printerFormater.drawLine();

    this.printerFormater.tableCustom([
      { text: "PRODUTO", align: "LEFT", cols: 20 },
      { text: "QTD UN", align: "CENTER", cols: 10 },
      { text: "VL UN", align: "CENTER", cols: 10 },
      { text: "VL Tot", align: "CENTER", cols: 10 },
    ]);

    sale.items.forEach((item) => {
      if (item.product.category_id === 1) {
        this.printerFormater.tableCustom([
          { text: item.product.name, align: "LEFT", cols: 20 },
          { text: item.quantity.toFixed(3), align: "CENTER", cols: 10 },
          {
            text: "R$" + item.storeProduct.price_unit,
            align: "CENTER",
            cols: 10,
          },
          {
            text: "R$" + item.total.toFixed(2),
            align: "CENTER",
            cols: 10,
          },
        ]);
      } else {
        this.printerFormater.tableCustom([
          { text: replaceSpecialChars(item.name), align: "LEFT", cols: 20 },
          { text: item.quantity.toString(), align: "CENTER", cols: 10 },
          {
            text: (+item.storeProduct.price_unit).toFixed(2).toString(),
            align: "CENTER",
            cols: 10,
          },
          {
            text: (+item.storeProduct.price_unit * +item.quantity)
              .toFixed(2)
              .toString(),
            align: "CENTER",
            cols: 10,
          },
        ]);
      }
    });
    this.printerFormater.drawLine();

    const totalItems = sale.items
      //@ts-ignore
      .reduce(
        (total, item) =>
          total + +(item?.storeProduct?.price_unit || 0) * +item.quantity,
        0
      )
      .toFixed(2)
      .toString();
    this.printerFormater.tableCustom([
      { text: "Qtd Total de Itens", align: "LEFT", cols: 40 },
      { text: sale.items.length.toString(), align: "CENTER", cols: 10 },
    ]);
    this.printerFormater.tableCustom([
      { text: "Valor Total dos Produtos", align: "LEFT", cols: 40 },
      { text: "R$" + totalItems, align: "CENTER", cols: 10 },
    ]);
    this.printerFormater.drawLine();

    if (sale.nfce?.qrcode_url) {
      this.printerFormater.table(["QRCode NOTA FISCAL"]);
      this.printerFormater.alignCenter();

      this.printerFormater.printQR(sale.nfce.qrcode_url, {
        correction: "M",
        cellSize: 7,
      });
      this.printerFormater.newLine();
    }

    const access_token = jwt.sign(
      {
        ref: sale.ref,
        cpf: null,
        cash_history_id: sale.cash_history_id,
        store_id: store?.company_id,
        total_sold: totalItems,
        created_at: created_at,
      },
      env.TOKEN_SECRET_NPS,
      {
        expiresIn: "1d",
      }
    );

    this.printerFormater.table(["QRCode Avaliação NPS"]);
    this.printerFormater.println(
      `Utilize este QRCode para ser direcionado para nos avaliar :)`
    );
    this.printerFormater.alignCenter();

    const qrcode_img = await axios.get(
      `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${env.NPS_URL}/${access_token}`,
      {
        responseType: "arraybuffer",
      }
    );

    const qrcode_64 = Buffer.from(qrcode_img.data, "binary");
    this.printerFormater.printImageBuffer(qrcode_64);
    this.printerFormater.newLine();
    this.printerFormater.print(
      `Data de expiração do QRCode: ${expirationDate}`
    );
    this.printerFormater.newLine();
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

export const printSale = new PrintSale();
