import { getImageTheBestGamesFiles } from "../usecases/filesManagement";
import { useCaseFactory } from "../usecases/useCaseFactory";


export const filesManagementFactory = {
    getImageTheBestGamesFiles: async () =>
        await useCaseFactory.execute<Buffer>(getImageTheBestGamesFiles),
};
