import { DiscountByQuantityConfig } from "../models/dtos/voucher";

export type CartLineForDiscountByQuantity = {
  id?: string;
  total: number;
  quantity?: number;
  product: {
    id: number;
    category?: { id: number };
  };
};

export type DiscountByQuantityResult =
  | { ok: true; discountBrl: number; awardedItemIds: string[] }
  | { ok: false; reason: "no_eligible_items" }
  | {
      ok: false;
      reason: "below_min_quantity";
      needed: number;
      current: number;
      required: number;
    }
  | {
      ok: false;
      reason: "grammage_not_met";
      requiredGrammage: number;
    };

type Unit = {
  itemId: string | undefined;
  unitPrice: number;
  isSelfService: boolean;
  grammage: number | null;
};

const SELF_SERVICE_PRODUCT_ID = 1;

export function computeDiscountByQuantity(
  config: DiscountByQuantityConfig,
  items: CartLineForDiscountByQuantity[],
): DiscountByQuantityResult {
  // Passo 0: coerção defensiva. O backend pode serializar numéricos como string.
  const minCombined = Number(config.min_combined_quantity);
  const quantityWithDiscount = Number(config.quantity_with_discount);
  const discountValue = Number(config.discount_value);
  const minGrammage =
    config.min_item_grammage === null || config.min_item_grammage === undefined
      ? null
      : Number(config.min_item_grammage);
  const triggerIds = (config.trigger_ids ?? []).map((v) => Number(v));

  if (
    !Number.isFinite(minCombined) ||
    !Number.isFinite(quantityWithDiscount) ||
    !Number.isFinite(discountValue) ||
    (minGrammage !== null && !Number.isFinite(minGrammage)) ||
    triggerIds.some((v) => !Number.isFinite(v))
  ) {
    return { ok: false, reason: "no_eligible_items" };
  }

  // 1. Filtrar itens elegíveis pelo trigger_mode.
  const eligibleItems = items.filter((item) => {
    if (config.trigger_mode === "product") {
      return triggerIds.includes(item.product.id);
    }
    const categoryId = item.product.category?.id;
    return categoryId !== undefined && triggerIds.includes(categoryId);
  });

  if (eligibleItems.length === 0) {
    return { ok: false, reason: "no_eligible_items" };
  }

  // 2. Expandir em unidades.
  //    - Self-service: 1 linha = 1 unidade. unitPrice = item.total (NUNCA dividir por
  //      quantity, que é peso em KG). grammage = quantity * 1000.
  //    - Não-self-service: 1 linha gera item.quantity unidades. unitPrice = total / quantity.
  //      grammage = null (regra ignorada — só faz sentido pra peso variável).
  const units: Unit[] = [];
  for (const item of eligibleItems) {
    const isSelfService = item.product.id === SELF_SERVICE_PRODUCT_ID;
    if (isSelfService) {
      const weightKg = item.quantity;
      units.push({
        itemId: item.id,
        unitPrice: item.total,
        isSelfService: true,
        grammage: typeof weightKg === "number" ? weightKg * 1000 : null,
      });
    } else {
      const rawQuantity = item.quantity;
      const unitCount =
        typeof rawQuantity === "number"
          ? Math.max(1, Math.round(rawQuantity))
          : 1;
      const unitPrice = item.total / unitCount;
      for (let i = 0; i < unitCount; i++) {
        units.push({
          itemId: item.id,
          unitPrice,
          isSelfService: false,
          grammage: null,
        });
      }
    }
  }

  if (units.length < minCombined) {
    return {
      ok: false,
      reason: "below_min_quantity",
      required: minCombined,
      current: units.length,
      needed: minCombined - units.length,
    };
  }

  // 3. Ordenar unidades por unitPrice (asc/desc conforme apply_discount_on).
  units.sort((a, b) =>
    config.apply_discount_on === "cheapest"
      ? a.unitPrice - b.unitPrice
      : b.unitPrice - a.unitPrice,
  );

  // 4. Recortar as primeiras minCombined unidades; dentro do recorte,
  //    as quantityWithDiscount primeiras são premiadas, as demais "pagas contadas".
  const slice = units.slice(0, minCombined);
  const awarded = slice.slice(0, quantityWithDiscount);
  const paidCounted = slice.slice(quantityWithDiscount);

  // 5. Gramatura: aplica APENAS às "pagas contadas" que são self-service.
  //    Premiadas, unidades fora do recorte e itens unitários ficam de fora —
  //    a regra só faz sentido pra peso variável, e a especificação fala
  //    em "itens não premiados que ENTRAM NA CONTAGEM".
  if (minGrammage !== null) {
    const failsGrammage = paidCounted.some(
      (u) =>
        u.isSelfService && u.grammage !== null && u.grammage < minGrammage,
    );
    if (failsGrammage) {
      return {
        ok: false,
        reason: "grammage_not_met",
        requiredGrammage: minGrammage,
      };
    }
  }

  // 6. Calcular desconto somando por unidade premiada.
  let discountBrl = 0;
  for (const u of awarded) {
    if (config.discount_mode === "percent") {
      discountBrl += u.unitPrice * (discountValue / 100);
    } else {
      discountBrl += Math.min(u.unitPrice, discountValue);
    }
  }

  const awardedIdSet = new Set<string>();
  for (const u of awarded) {
    if (u.itemId !== undefined) {
      awardedIdSet.add(u.itemId);
    }
  }
  const awardedItemIds = Array.from(awardedIdSet);

  return {
    ok: true,
    discountBrl: +discountBrl.toFixed(2),
    awardedItemIds,
  };
}
