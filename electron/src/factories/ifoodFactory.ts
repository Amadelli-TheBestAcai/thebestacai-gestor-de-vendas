import { useCaseFactory } from "../usecases/useCaseFactory";
import { authentication, pooling, reasonsToCancel } from "../usecases/ifood";

export const ifoodFactory = {
  pooling: async () => await useCaseFactory.execute<any>(pooling),
  reasonsToCancel: async () =>
    await useCaseFactory.execute<any>(reasonsToCancel),
};
