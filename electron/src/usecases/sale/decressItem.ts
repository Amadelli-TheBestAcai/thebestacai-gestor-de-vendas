import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { getCurrentSale } from "./getCurrentSale";
import { SaleDto } from "../../models/gestor";

interface Request {
  id: string;
}

class DecressItem implements IUseCaseFactory {
  constructor(
    private saleRepository = new BaseRepository<SaleDto>(StorageNames.Sale),
    private getCurrentSaleUseCase = getCurrentSale
  ) {}

  async execute({ id }: Request): Promise<SaleDto> {
    const { response: sale, has_internal_error: errorOnGetCurrentSale } =
      await useCaseFactory.execute<SaleDto>(this.getCurrentSaleUseCase);

    if (errorOnGetCurrentSale) {
      throw new Error("Erro ao integrar venda");
    }
    if (!sale) {
      throw new Error("Nenhuma venda encontrada");
    }

    const itemIndex = sale.items.findIndex((_item) => _item.id === id);

    const newQuantity = +sale.items[itemIndex]?.quantity - 1;

    if (sale.items[itemIndex]?.product.category.id === 1 || newQuantity <= 0) {
      sale.items = sale.items.filter((_item) => _item.id !== id);
    } else {
      sale.items[itemIndex].quantity = newQuantity;
      const calculatedTotal = +(
        newQuantity * +(sale.items[itemIndex].storeProduct.price_unit || 0)
      ).toFixed(2);

      console.log("=== DECRESSITEM ===");
      console.log("newQuantity:", newQuantity);
      console.log("price_unit:", sale.items[itemIndex].storeProduct.price_unit);
      console.log(
        "price_unit convertido:",
        +(sale.items[itemIndex].storeProduct.price_unit || 0)
      );
      console.log(
        "multiplicação bruta:",
        newQuantity * +(sale.items[itemIndex].storeProduct.price_unit || 0)
      );
      console.log("total calculado com toFixed(2):", calculatedTotal);

      sale.items[itemIndex].total = calculatedTotal;
    }

    console.log("=== DECRESSITEM - RESUMO ===");
    console.log(
      "Items após modificação:",
      sale.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        total: item.total,
        price_unit: item.storeProduct.price_unit,
      }))
    );

    sale.total_sold = +sale.items
      .reduce((total, item) => item.total + total, 0)
      .toFixed(2);

    console.log("total_sold calculado:", sale.total_sold);

    if (sale.customerVoucher?.voucher?.products?.length)
      sale.customerVoucher?.voucher?.products.forEach(
        (product) => (sale.total_sold -= +product.price_sell)
      );

    sale.quantity = sale.items.reduce(
      (total, item) =>
        +item.product?.category.id === 1 ? 1 + total : item.quantity + total,
      0
    );

    await this.saleRepository.update(sale.id, sale);
    return sale;
  }
}

export const decressItem = new DecressItem();
