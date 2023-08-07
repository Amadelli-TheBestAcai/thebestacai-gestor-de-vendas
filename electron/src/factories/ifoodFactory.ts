import { useCaseFactory } from "../usecases/useCaseFactory";

import {
  authentication,
  getCatalogs,
  updateProductStatus,
  getCodeVerifier,
  pooling,
  update,
  updateOrderStatus,
  reasonsToCancel,
} from "../usecases/ifood";

import { IfoodDto } from "../models/gestor";

import { CatalogDto, CodeVerifierDto } from "../usecases/ifood/dtos";

export const ifoodFactory = {
  authentication: async () =>
    await useCaseFactory.execute<IfoodDto>(authentication),
  getCatalogs: async () =>
    await useCaseFactory.execute<CatalogDto>(getCatalogs),
  getCodeVerifier: async () =>
    await useCaseFactory.execute<CodeVerifierDto>(getCodeVerifier),
  update: async () => await useCaseFactory.execute<IfoodDto>(update),
  pooling: async () => await useCaseFactory.execute<IfoodDto>(pooling),
  reasonsToCancel: async () =>
    await useCaseFactory.execute<
      { cancelCodeId: string; description: string }[]
    >(reasonsToCancel),
  updateProductStatus: async (
    status: "AVAILABLE" | "UNAVAILABLE",
    category_id: string,
    product_id: string,
    catalog_id: string
  ) =>
    await useCaseFactory.execute<IfoodDto>(updateProductStatus, {
      status,
      category_id,
      product_id,
      catalog_id,
    }),
  updateOrderStatus: async (
    id: string,
    status:
      | "confirm"
      | "startPreparation"
      | "confirm"
      | "readyToPickup"
      | "acceptCancellation"
      | "denyCancellation"
      | "requestCancellation",
    reasson?: {
      reason: string;
      cancellationCode: string;
    }
  ) =>
    await useCaseFactory.execute<IfoodDto>(updateOrderStatus, {
      id,
      status,
      reasson,
    }),
};
