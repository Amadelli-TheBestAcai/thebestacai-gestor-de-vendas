import { useCaseFactory } from "../usecases/useCaseFactory";
import { insertItemOutCart, integrationItemOutCart } from "../usecases/itemOutCart";
import { ItemOutCartDto } from "../models/gestor";

export const itemOutCartFactory = {
  create: async (reason: string, product_id: number) =>
    await useCaseFactory.execute<ItemOutCartDto | undefined>(
      insertItemOutCart,
      { reason, product_id }
    ),
  integrationItemOutCart: async () =>
    await useCaseFactory.execute<void>(integrationItemOutCart)
};
