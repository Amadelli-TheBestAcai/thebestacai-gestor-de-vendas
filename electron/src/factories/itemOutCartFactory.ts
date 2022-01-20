import itemOutCart, { Entity } from "../models/itemOutCart";

export const itemOutCartFactory = {
  create: async (reason: string, product_id: number) =>
    await itemOutCart.insert(reason, product_id),
};
