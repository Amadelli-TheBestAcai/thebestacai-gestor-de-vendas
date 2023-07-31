import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { StoreDto, SettingsDto } from "../../models/gestor";
import {
  printer as ThermalPrinter,
  types as TermalTypes,
} from "node-thermal-printer";
import Printer from "printer";
import axios from "axios";
import { ipcRenderer } from "electron";

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
      lineCharacter: "=",
      options: {
        timeout: 5000,
      },
    });
  }

  async execute({ payload }: Request): Promise<void> {
    const settings = await this.settingsRepository.getOne();

    const printer = settings?.printer;

    if (!settings?.should_use_printer) {
      return;
    }

    const response = await ipcRenderer.invoke("get-danfe", payload);
    console.log({ response });

    // const termalPrinter = Printer.getPrinter(printer);

    // Printer.printDirect({
    //   data: this.printerFormater.getBuffer(),
    //   options: termalPrinter.options,
    //   printer,
    //   type: "RAW",
    //   success: function () {
    //     console.log("printed with success");
    //   },
    //   error: function (err) {
    //     console.log(err);
    //   },
    // });
  }
}

export const printDanfe = new PrintDanfe();
