import { getFilesTheBestGames } from "../usecases/filesManagement";
import { useCaseFactory } from "../usecases/useCaseFactory";

export const filesManagementFactory = {
  getFilesTheBestGames: async () =>
    await useCaseFactory.execute<any>(getFilesTheBestGames),
};
