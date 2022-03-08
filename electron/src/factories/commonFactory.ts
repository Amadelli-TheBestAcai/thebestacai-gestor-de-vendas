import { useCaseFactory } from "../usecases/useCaseFactory";
import { SaleFromApiDTO } from '../models/dtos/salesFromApi'
import {
  checkUpdates,
  printSale
} from "../usecases/common";

export const commonFactory = {
  checkForUpdates: async (pkg_version: string) =>
    await useCaseFactory.execute<{ has_update: boolean, is_mandatory: boolean }>(checkUpdates, { pkg_version }),
  printSale: async (sale: SaleFromApiDTO) =>
    await useCaseFactory.execute<void>(printSale, { sale })
};
