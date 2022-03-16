import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { StoreDto, SettingsDto } from "../../models/gestor";
import { HandlerApiDto } from "../../models/dtos/handlerFromApi";
import { replaceSpecialChars } from '../../helpers/replaceSpecialChars'
import {
  printer as ThermalPrinter,
  types as TermalTypes,
} from 'node-thermal-printer'
import Printer from 'printer'

interface Request {
  handler: HandlerApiDto
}

class PrintHandler implements IUseCaseFactory {
  printerFormater: ThermalPrinter
  constructor(
    private storeRepository = new BaseRepository<StoreDto>(StorageNames.Store),
    private settingsRepository = new BaseRepository<SettingsDto>(StorageNames.Settings)
  ) {
    this.printerFormater = new ThermalPrinter({
      type: TermalTypes.EPSON,
      interface: 'tcp://xxx.xxx.xxx.xxx',
      characterSet: 'SLOVENIA',
      removeSpecialCharacters: false,
      lineCharacter: '=',
      options: {
        timeout: 5000,
      },
    })
  }

  async execute({ handler }: Request): Promise<void> {
    const store = await this.storeRepository.getOne()
    const settings = await this.settingsRepository.getOne()

    const printer = settings?.printer

    if (!settings?.should_use_printer) {
      return
    }

    const termalPrinter = Printer.getPrinter(printer)

    this.printerFormater.clear()
    this.printerFormater.tableCustom([
      { text: 'THE BEST ACAI', align: 'LEFT', width: 0.5, bold: true },
      {
        text: `THE BEST ACAI: ${replaceSpecialChars(store?.company.company_name || '')}`,
        align: 'RIGHT',
        width: 0.5,
        bold: true,
      },
    ])
    this.printerFormater.drawLine()

    this.printerFormater.tableCustom([
      { text: 'DATA', align: 'LEFT', cols: 20 },
      { text: 'TIPO', align: 'CENTER', cols: 10 },
      { text: 'VALOR', align: 'CENTER', cols: 10 },
      { text: 'RAZAO', align: 'CENTER', cols: 10 },
    ])

    this.printerFormater.tableCustom([
      { text: handler.created_at, align: 'LEFT', cols: 20 },
      { text: handler.type === 0 ? 'ENTRADA' : 'SAIDA', align: 'CENTER', cols: 10 },
      {
        text: handler.amount.replace('.', ','),
        align: 'CENTER',
        cols: 10,
      },
      {
        text: handler.reason,
        align: 'CENTER',
        cols: 10,
      },
    ])

    this.printerFormater.drawLine()
    this.printerFormater.cut()
    Printer.printDirect({
      data: this.printerFormater.getBuffer(),
      options: termalPrinter.options,
      printer,
      type: 'RAW',
      success: function () {
        console.log('printed with success')
      },
      error: function (err) {
        console.log(err)
      },
    })
  }
}

export const printHandler = new PrintHandler();
