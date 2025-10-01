import { getTheBestGamesFiles } from "../usecases/filesManagement";
import { useCaseFactory } from "../usecases/useCaseFactory";


export const filesManagementFactory = {
    getTheBestGamesFiles: async () =>
        await useCaseFactory.execute<any>(getTheBestGamesFiles),
};
