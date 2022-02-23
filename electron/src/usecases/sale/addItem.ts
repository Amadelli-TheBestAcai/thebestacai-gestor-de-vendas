import { useCaseFactory } from "../useCaseFactory";
import { BaseRepository } from "../../repository/baseRepository";
import { IUseCaseFactory } from "../useCaseFactory.interface";
import { StorageNames } from "../../repository/storageNames";
import { getCurrentSale } from "./getCurrentSale";
import { SaleDto, ProductDto } from "../../models/gestor";
import { v4 } from "uuid";
import moment from "moment";

interface Request {
  productToAdd: ProductDto;
  quantity: number;
  price?: number;
}

class AddItem implements IUseCaseFactory {
  constructor(
    private saleRepository = new BaseRepository<SaleDto>(StorageNames.Sale),
    private getCurrentSaleUseCase = getCurrentSale
  ) {}

  async execute({ productToAdd, quantity, price }: Request): Promise<SaleDto> {
    const { response: sale, has_internal_error: errorOnGetCurrentSale } =
      await useCaseFactory.execute<SaleDto>(this.getCurrentSaleUseCase);

    if (errorOnGetCurrentSale) {
      throw new Error("Erro ao integrar venda");
    }
    if (!sale) {
      throw new Error("Nenhuma venda encontrada");
    }

    const itemIndex = sale.items.findIndex(
      (_item) => _item.product.id === productToAdd.product.id
    );

    if (itemIndex >= 0 && sale.items[itemIndex].product.category.id !== 1) {
      const newQuantity = +sale.items[itemIndex].quantity + quantity;
      sale.items[itemIndex].quantity = newQuantity;
      sale.items[itemIndex].total = +(
        newQuantity * +(productToAdd.price_unit || 0)
      ).toFixed(2);
    } else {
      const { product, ...storeProduct } = productToAdd;
      sale.items.push({
        id: v4(),
        store_product_id: storeProduct.id,
        quantity,
        update_stock: product.category.id !== 1 ? true : false,
        product,
        storeProduct,
        total:
          product.category.id === 1
            ? +(price || 0)
            : +(productToAdd.price_unit || 0) * quantity,
        created_at: moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
      });
    }

    sale.total_sold = +sale.items
      .reduce((total, item) => item.total + total, 0)
      .toFixed(2);

    sale.quantity = sale.items.reduce(
      (total, item) =>
        +item.product.category.id === 1 ? 1 + total : item.quantity + total,
      0
    );

    await this.saleRepository.update(sale.id, sale);
    return sale;
  }
}

export const addItem = new AddItem();
