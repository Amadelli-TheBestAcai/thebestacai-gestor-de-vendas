import { SaleDto } from "../models/dtos/sale";
import { CouponConfig } from "../models/dtos/voucher";
import { computeDiscountByQuantity } from "./discountByQuantity";

export type CartLineForVoucherDiscount = {
  id?: string;
  product: { id: number; category?: { id: number } };
  total: number;
  quantity?: number;
};

export type VoucherProductForDiscount = {
  product_id?: number;
  product_name?: string;
  price_sell: string;
  discount_type?: number;
  additional_value?: string | null;
};

export type VoucherForDiscount = {
  self_service: boolean;
  self_service_discount_type: number;
  price_sell: string;
  products?: VoucherProductForDiscount[];
  voucher_type?: string | null;
  voucher_config?: CouponConfig | null;
};

function isSyntheticSelfServiceDiscountLine(
  voucherSelfService: boolean,
  productVoucher: {
    product_id?: number;
    product_name?: string;
  },
): boolean {
  return (
    !!voucherSelfService &&
    productVoucher.product_id === 1 &&
    !!productVoucher.product_name?.includes("Desconto de") &&
    !!productVoucher.product_name?.includes("Self-service")
  );
}

export function getVoucherDiscountBrlFromVoucherAndItems(
  voucher: VoucherForDiscount | null | undefined,
  items: CartLineForVoucherDiscount[],
): number {
  if (!voucher) {
    return 0;
  }

  if (voucher.voucher_type === "gift_by_subtotal") {
    return 0;
  }

  if (
    voucher.voucher_type === "discount_by_quantity" &&
    voucher.voucher_config
  ) {
    const voucherConfig: any = voucher.voucher_config;
    const result = computeDiscountByQuantity(voucherConfig, items);
    return result.ok ? result.discountBrl : 0;
  }

  const products = voucher.products ?? [];

  if (products.length === 0) {
    const totalSoldInSelfService = items
      .filter((item) => item.product.id === 1)
      .reduce((acc, item) => acc + item.total, 0);
    const totalCart = items.reduce((acc, item) => acc + item.total, 0);
    const eligibleTotal = totalCart - totalSoldInSelfService;
    if (eligibleTotal <= 0) {
      return 0;
    }
    if (voucher.self_service_discount_type === 1) {
      return +(eligibleTotal * (+voucher.price_sell / 100)).toFixed(2);
    }
    const fixed = +voucher.price_sell;
    return Math.min(fixed, eligibleTotal);
  }

  let totalProductsPart = 0;

  for (const productVoucher of products) {
    if (
      isSyntheticSelfServiceDiscountLine(voucher.self_service, productVoucher)
    ) {
      totalProductsPart += +productVoucher.price_sell;
      continue;
    }

    const item = items.find((i) => i.product.id === productVoucher.product_id);

    if (item) {
      let discountAmount = 0;
      if (productVoucher.discount_type === 1) {
        discountAmount = +item.total * (+productVoucher.price_sell / 100);
      } else {
        discountAmount = +productVoucher.price_sell;
      }
      totalProductsPart += discountAmount;
    }

    if (productVoucher.additional_value) {
      totalProductsPart -= +productVoucher.additional_value;
    }
  }

  return Math.abs(+totalProductsPart.toFixed(2));
}

export function getCustomerVoucherDiscountBrl(sale: SaleDto): number {
  return getVoucherDiscountBrlFromVoucherAndItems(
    sale.customerVoucher?.voucher ?? null,
    sale.items,
  );
}
