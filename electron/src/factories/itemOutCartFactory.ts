import { useCaseFactory } from "../usecases/useCaseFactory";
import { insertItemOutCart } from "../usecases/itemOutCart";
import { ItemOutCartDto } from "../models/gestor";

export const itemOutCartFactory = {
  create: async (reason: string, product_id: number) =>
    await useCaseFactory.execute<ItemOutCartDto | undefined>(
      insertItemOutCart,
      { reason, product_id }
    ),
};
