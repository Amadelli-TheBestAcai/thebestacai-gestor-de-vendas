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
  openExternalLink,
  findOrCreate,
} from "../usecases/ifood";

import { IfoodDto } from "../models/gestor";

import { CatalogDto, CodeVerifierDto } from "../usecases/ifood/dtos";

export const ifoodFactory = {
  findOrCreate: async () =>
    await useCaseFactory.execute<IfoodDto>(findOrCreate),
  authentication: async () =>
    await useCaseFactory.execute<IfoodDto>(authentication),
  getCatalogs: async () =>
    await useCaseFactory.execute<CatalogDto>(getCatalogs),
  getCodeVerifier: async () =>
    await useCaseFactory.execute<CodeVerifierDto>(getCodeVerifier),
  update: async (payload: Partial<IfoodDto>) =>
    await useCaseFactory.execute<IfoodDto>(update, { payload }),
  pooling: async () =>
    await useCaseFactory.execute<{
      response: IfoodDto;
      has_error: boolean;
      error_message?: string;
    }>(pooling),
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
  openExternalLink: async (url: string) =>
    await useCaseFactory.execute<any>(openExternalLink, url),
};