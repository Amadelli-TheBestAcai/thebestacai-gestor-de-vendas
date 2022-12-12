import { useCaseFactory } from "../usecases/useCaseFactory";
import {
  updateProductStock,
  getProductStoreHistory,
  getAllProductStore,
  getAllPurchaseProducts,
  getSelfService,
  getProducts,
} from "../usecases/product";
import { ProductDto, PurchaseProductDto, AuditDto } from "../models/gestor";

export const productFactory = {
  getProducts: async (local = false) =>
    await useCaseFactory.execute<ProductDto[]>(getProducts, { local }),
  getSelfService: async () =>
    await useCaseFactory.execute<ProductDto>(getSelfService),
  getAllPurchaseProducts: async (local = true) =>
    await useCaseFactory.execute<PurchaseProductDto[]>(getAllPurchaseProducts, { local }),
  getAllProductStore: async () =>
    await useCaseFactory.execute<ProductDto[]>(getAllProductStore),
  GetProductStoreHistory: async (id: number, page: number, size: number) =>
    await useCaseFactory.execute<AuditDto>(getProductStoreHistory, {
      id,
      page,
      size,
    }),
  updateProductStock: async (id: number, quantity: number) =>
    await useCaseFactory.execute<ProductDto>(updateProductStock, {
      id,
      quantity,
    }),
};
