import { useCaseFactory } from "../usecases/useCaseFactory";
import {
  checkUpdates
} from "../usecases/common";

export const commonFactory = {
  checkForUpdates: async (pkg_version: string) =>
    await useCaseFactory.execute<{ has_update: boolean, is_mandatory: boolean }>(checkUpdates, pkg_version)
};
