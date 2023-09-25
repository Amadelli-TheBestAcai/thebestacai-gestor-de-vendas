import {
  printer as ThermalPrinter,
  types as TermalTypes,
} from "node-thermal-printer";
import Printer from "printer";
import moment from "moment";

import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { BaseRepository } from "../../repository/baseRepository";

import { OrderDto, SettingsDto } from "../../models/gestor";

import { replaceSpecialChars } from "../../helpers/replaceSpecialChars";

class PrintOrder implements IUseCaseFactory {
  printerFormater: ThermalPrinter;
  constructor(
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

  async execute({ order }: { order: OrderDto }): Promise<void> {
    const settings = await this.settingsRepository.getOne();

    const printer = settings?.printer;

    if (!settings?.should_use_printer) {
      return;
    }

    const termalPrinter = Printer.getPrinter(printer);

    this.printerFormater.clear();

    this.printerFormater.alignCenter();
    this.printerFormater.println(`**** Pedido #${order.displayId} ****`);
    this.printerFormater.println(order.orderType);
    this.printerFormater.println(order.merchant?.name);

    this.printerFormater.alignLeft();
    this.printerFormater.println(
      `Data do pedido: ${moment(order.preparationStartDateTime).format(
        "DD/MM/YYYY HH:mm:ss"
      )}`
    );
    if (order.delivery?.deliveryDateTime) {
      this.printerFormater.println(
        `Data da entrega: ${moment(order.delivery?.deliveryDateTime).format(
          "DD/MM/YYYY HH:mm:ss"
        )}`
      );
    }

    this.printerFormater.println(
      `Cliente: ${order.customer?.name?.toUpperCase()}`
    );
    this.printerFormater.println(`Telefone: ${order.customer?.phone?.number}`);
    this.printerFormater.println(
      `${order.customer?.ordersCountOnMerchant} pedidos na sua loja`
    );

    this.printerFormater.drawLine();

    this.printerFormater.alignCenter();
    this.printerFormater.println("ITEMS DO PEDIDO");

    this.printerFormater.alignLeft();
    order.items.forEach((item) => {
      this.printerFormater.println(`${item.quantity}${item.unit}`);
      this.printerFormater.tableCustom([
        { text: replaceSpecialChars(item.name), align: "LEFT", cols: 35 },
        { text: `R$ ${item.price}`, align: "CENTER", cols: 15 },
      ]);
      if (item.options?.length) {
        item.options.forEach((option) => {
          this.printerFormater.println(
            ` ${option.quantity} ${option.unit} ${option.name}`
          );
        });
      }
      if (item.observations) {
        this.printerFormater.println(`Obs: ${item.observations}`);
      }
      this.printerFormater.tableCustom([
        { text: "Total de itens e complemento", align: "LEFT", cols: 35 },
        { text: `R$ ${item.totalPrice.toFixed(2)}`, align: "CENTER", cols: 15 },
      ]);

      this.printerFormater.drawLine();
    });

    this.printerFormater.alignCenter();
    this.printerFormater.println("TOTAL");

    this.printerFormater.tableCustom([
      { text: "Valor Total dos Items", align: "LEFT", cols: 35 },
      {
        text: `R$ ${order.items
          .reduce((total, item) => total + item.totalPrice, 0)
          .toFixed(2)}`,
        align: "CENTER",
        cols: 15,
      },
    ]);
    this.printerFormater.tableCustom([
      { text: "Total da Entrega", align: "LEFT", cols: 35 },
      {
        text: `R$ ${order.total.deliveryFee.toFixed(2)}`,
        align: "CENTER",
        cols: 15,
      },
    ]);
    this.printerFormater.tableCustom([
      { text: "Taxa", align: "LEFT", cols: 35 },
      {
        text: `R$ ${order.total.additionalFees.toFixed(2)}`,
        align: "CENTER",
        cols: 15,
      },
    ]);
    this.printerFormater.tableCustom([
      { text: "Descontos (Ifood/Loja)", align: "LEFT", cols: 35 },
      {
        text: `- R$ ${order.total.benefits.toFixed(2)}`,
        align: "CENTER",
        cols: 15,
      },
    ]);
    this.printerFormater.tableCustom([
      { text: "VALOR TOTAL", align: "LEFT", cols: 35 },
      {
        text: `R$ ${order.total.orderAmount.toFixed(2)}`,
        align: "CENTER",
        cols: 15,
      },
    ]);

    this.printerFormater.drawLine();

    this.printerFormater.alignCenter();
    this.printerFormater.println("FORMA DE PAGAMENTO");
    this.printerFormater.alignLeft();
    if (order.payments.prepaid) {
      const prePaidPayment = order.payments.methods.find(
        (payment) => payment.prepaid
      );
      this.printerFormater.tableCustom([
        {
          text: `Pagamento ${prePaidPayment?.type} (${prePaidPayment?.method})`,
          align: "LEFT",
          cols: 35,
        },
        { text: `R$ ${prePaidPayment?.value}`, align: "CENTER", cols: 15 },
      ]);
    }
    if (order.payments.pending) {
      this.printerFormater.println("Cobrar do cliente na entrega:");
      const notPrePaidPayments = order.payments.methods.filter(
        (payment) => !payment.prepaid
      );
      notPrePaidPayments.forEach((notPrePaidPayment) => {
        this.printerFormater.tableCustom([
          {
            text: ` ${notPrePaidPayment?.type} (${notPrePaidPayment?.card.brand})`,
            align: "LEFT",
            cols: 30,
          },
          {
            text: `R$ ${notPrePaidPayment?.value.toFixed(2)}`,
            align: "CENTER",
            cols: 15,
          },
        ]);
      });
    }
    this.printerFormater.drawLine();

    this.printerFormater.alignCenter();
    this.printerFormater.println(`ENTREGA DO PEDIDO #${order.displayId}`);
    this.printerFormater.alignLeft();
    this.printerFormater.println(
      `Entregue por: ${order.delivery?.deliveredBy}`
    );
    if (order.delivery?.deliveryDateTime) {
      this.printerFormater.println(
        `Horario da Entrega: ${moment(order.delivery?.deliveryDateTime).format(
          "DD/MM/YYYY HH:mm:ss"
        )}`
      );
    }
    this.printerFormater.println(`Cliente: ${order.customer?.name}`);
    this.printerFormater.println(
      `Endereço: ${order.delivery?.deliveryAddress.formattedAddress}`
    );
    this.printerFormater.println(
      `Comp: ${order.delivery?.deliveryAddress.complement}`
    );
    this.printerFormater.println(
      `Bairro: ${order.delivery?.deliveryAddress.neighborhood}`
    );
    this.printerFormater.println(
      `Cidade: ${order.delivery?.deliveryAddress.city}`
    );
    this.printerFormater.println(
      `Cep: ${order.delivery?.deliveryAddress.postalCode}`
    );

    this.printerFormater.drawLine();
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

export const printOrder = new PrintOrder();
