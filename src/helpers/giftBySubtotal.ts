import { GiftBySubtotalConfig } from "../models/dtos/voucher";

export type CartLineForGiftBySubtotal = {
  total: number;
  product: {
    id: number;
    category?: { id: number };
  };
};

export type GiftBySubtotalResult =
  | { ok: true; subtotal: number; required: number }
  | { ok: false; reason: "invalid_config" }
  | {
      ok: false;
      reason: "below_min_subtotal";
      missing: number;
      subtotal: number;
      required: number;
    };

function isEligible(
  item: CartLineForGiftBySubtotal,
  triggerMode: GiftBySubtotalConfig["trigger_mode"],
  triggerIds: number[],
): boolean {
  if (triggerMode === "product") {
    return triggerIds.includes(item.product.id);
  }
  const categoryId = item.product.category?.id;
  return categoryId !== undefined && triggerIds.includes(categoryId);
}

export function computeGiftBySubtotal(
  config: GiftBySubtotalConfig,
  items: CartLineForGiftBySubtotal[],
): GiftBySubtotalResult {
  const minSubtotal = Number(config.min_subtotal);
  const triggerIds = (config.trigger_ids ?? []).map((v) => Number(v));

  if (
    !Number.isFinite(minSubtotal) ||
    minSubtotal <= 0 ||
    triggerIds.some((v) => !Number.isFinite(v))
  ) {
    return { ok: false, reason: "invalid_config" };
  }

  const subtotal = +items
    .filter((item) => isEligible(item, config.trigger_mode, triggerIds))
    .reduce((acc, item) => acc + item.total, 0)
    .toFixed(2);

  if (subtotal < minSubtotal) {
    return {
      ok: false,
      reason: "below_min_subtotal",
      missing: +(minSubtotal - subtotal).toFixed(2),
      subtotal,
      required: minSubtotal,
    };
  }

  return { ok: true, subtotal, required: minSubtotal };
}
