import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { getCurrentSale } from "./getCurrentSale";
import { SaleDto, ProductDto } from "../../models/gestor";

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

    const newQuantity = +sale.items[itemIndex].quantity - 1;

    if (sale.items[itemIndex].product.category.id === 1 || newQuantity <= 0) {
      sale.items = sale.items.filter((_item) => _item.id !== id);
    } else {
      sale.items[itemIndex].quantity = newQuantity;
      sale.items[itemIndex].total =
        newQuantity * +(sale.items[itemIndex].storeProduct.price_unit || 0);
    }

    sale.total_sold = sale.items.reduce(
      (total, item) =>
        +(item.storeProduct?.price_unit || 0) * item.quantity + total,
      0
    );

    sale.quantity = sale.items.reduce(
      (total, item) => item.quantity + total,
      0
    );

    await this.saleRepository.update(sale.id, sale);
    return sale;
  }
}

export const decressItem = new DecressItem();
