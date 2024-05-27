import { useCaseFactory } from "../usecases/useCaseFactory";
import { SaleFromApiDTO, HandlerApiDto } from "../models/dtos";
import {
  checkUpdates,
  printSale,
  printHandler,
  printDanfe,
  printFileContent,
} from "../usecases/common";

export const commonFactory = {
  checkForUpdates: async (pkg_version: string) =>
    await useCaseFactory.execute<{
      has_update: boolean;
      is_mandatory: boolean;
    }>(checkUpdates, { pkg_version }),
  printSale: async (sale: SaleFromApiDTO) =>
    await useCaseFactory.execute<void>(printSale, { sale }),
  printHandler: async (handler: HandlerApiDto) =>
    await useCaseFactory.execute<void>(printHandler, { handler }),
  printDanfe: async (payload) =>
    await useCaseFactory.execute<void>(printDanfe, { payload }),
  printCupomTef: async () =>
    await useCaseFactory.execute<any>(printFileContent),
};
