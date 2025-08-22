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
      throw new Error("Erro ao obter venda atual");
    }
    if (!sale) {
      throw new Error("Nenhuma venda encontrada");
    }

    const itemIndex = sale.items.findIndex(
      (_item) =>
        !_item.customer_reward_id &&
        _item.product?.id === productToAdd.product?.id
    );

    if (itemIndex >= 0 && sale.items[itemIndex].product?.category.id !== 1) {
      const newQuantity = +sale.items[itemIndex].quantity + quantity;
      sale.items[itemIndex].quantity = newQuantity;
      const calculatedTotal = +(
        newQuantity * +(productToAdd?.price_unit || 0)
      ).toFixed(2);

      console.log("=== ADDITEM - ITEM EXISTENTE ===");
      console.log("newQuantity:", newQuantity);
      console.log("price_unit:", productToAdd?.price_unit);
      console.log("price_unit convertido:", +(productToAdd?.price_unit || 0));
      console.log(
        "multiplicação bruta:",
        newQuantity * +(productToAdd?.price_unit || 0)
      );
      console.log("total calculado com toFixed(2):", calculatedTotal);

      sale.items[itemIndex].total = calculatedTotal;
    } else {
      const { product, ...storeProduct } = productToAdd;
      const calculatedTotal = price
        ? +price.toFixed(2)
        : +(+(productToAdd.price_unit || 0) * quantity).toFixed(2);

      console.log("=== ADDITEM - NOVO ITEM ===");
      console.log("price fornecido:", price);
      console.log("price_unit:", productToAdd.price_unit);
      console.log("quantity:", quantity);
      console.log(
        "multiplicação bruta:",
        +(productToAdd.price_unit || 0) * quantity
      );
      console.log("total calculado com toFixed(2):", calculatedTotal);

      sale.items.push({
        id: v4(),
        store_product_id: storeProduct.id,
        quantity,
        update_stock: product?.category.id !== 1 ? true : false,
        product,
        storeProduct,
        total: calculatedTotal,
        customer_reward_id: productToAdd.customer_reward_id,
        created_at: moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
      });
    }

    console.log("=== ADDITEM - RESUMO ===");
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

export const addItem = new AddItem();
