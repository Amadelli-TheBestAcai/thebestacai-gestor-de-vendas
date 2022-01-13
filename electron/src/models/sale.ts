import { BaseRepository } from "../repository/baseRepository";
import { Entity as ProductDto } from "./product";
import userModel from "./user";
import storeCashModel from "./storeCash";
// import integrationModel from "./integration";
import { v4 } from "uuid";
import moment from "moment";
import { checkInternet } from "../providers/internetConnection";
import midasApi from "../providers/midasApi";
import { SaleDto } from "./dtos/sale";

export type Entity = {
  id: string;
  user_id?: number;
  quantity: number;
  change_amount: number;
  type: number;
  discount: number;
  nfce_id?: number;
  nfce_url?: string;
  created_at?: string;
  deleted_at?: string;
  cash_id?: number;
  client_id?: number;
  cash_history_id?: number;
  is_online: boolean;
  is_current: boolean;
  is_integrated: boolean;
  to_integrate: boolean;
  total_paid: number;
  total_sold: number;
  items: {
    id: string;
    store_product_id: number;
    total: number;
    product: {
      id: number;
      name: string;
      price_buy?: string;
      permission_store?: boolean;
      permission_order?: boolean;
      permission_purchase?: boolean;
      cod_product?: string;
      cod_ncm?: number;
      brand?: string;
      unity?: number;
      weight?: string;
      price_sell?: string;
      description?: string;
      created_at?: string;
      deleted_at?: string;
      category: {
        id: number;
        name: string;
        sort?: number;
        created_at?: string;
        deleted_at?: string;
      };
    };
    quantity: number;
    created_at: string;
    deleted_at?: string;
    update_stock: boolean;
    storeProduct: {
      id: number;
      product_id?: number;
      store_id?: number;
      price_unit?: string;
      permission: boolean;
      price_sell?: string;
      unity?: string;
      unity_taxable?: string;
      price_taxable?: string;
      cfop?: number;
      icms_origin?: number;
      icms_tax_situation?: string;
      tax_regime?: number;
      pis_tax_situation?: string;
      pis_aliquot_value?: string;
      pis_aliquot_percentage?: string;
      cofins_tax_situation?: string;
      cofins_aliquot_value?: string;
      cofins_aliquot_percentage?: string;
      additional_information?: string;
      price_permission: boolean;
      icms_aliquot_percentage?: string;
      bc_icms?: string;
      bc_icms_st?: string;
      redution_icms?: string;
      aliquot_final_consumer?: string;
      quantity?: number;
      created_at: string;
      deleted_at?: string;
    };
  }[];
  payments: {
    id: string;
    amount: number;
    type: number;
    created_at?: string;
    deleted_at?: string;
  }[];
};

class Sale extends BaseRepository<Entity> {
  currentSale: Entity | null = null;
  constructor(storageName = "Sale") {
    super(storageName);
  }

  async getCurrent(): Promise<Entity> {
    const sales = await this.getAll();
    const currentSale = sales.find((_sale) => _sale.is_current);
    if (currentSale) {
      return currentSale;
    } else {
      const newSale: Entity = await this.buildNewSale();
      await this.createMany([...sales, newSale]);
      return newSale;
    }
  }

  async finishSale(): Promise<Entity> {
    const sales = await this.getAll();
    const saleIndex = sales.findIndex((_sale) => _sale.is_current);

    sales[saleIndex].is_current = false;
    sales[saleIndex].to_integrate = true;

    const newSale: Entity = await this.buildNewSale();
    await this.createMany([...sales, newSale]);

    // await integrationModel.moveToPreIntegration();

    return newSale;
  }

  async addPayment(amount: number, type: number): Promise<Entity> {
    const sales = await this.getAll();
    const saleIndex = sales.findIndex((_sale) => _sale.is_current);

    sales[saleIndex].payments.push({
      id: v4(),
      amount,
      type,
      created_at: moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
    });

    sales[saleIndex].total_paid = +sales[saleIndex].payments
      .reduce((total, payment) => +payment.amount + total, 0)
      .toFixed(2);

    await this.createMany(sales);
    return sales[saleIndex];
  }

  async deletePayment(id: string): Promise<Entity> {
    const sales = await this.getAll();
    const saleIndex = sales.findIndex((_sale) => _sale.is_current);

    sales[saleIndex].payments = sales[saleIndex].payments.filter(
      (_payment) => _payment.id !== id
    );

    sales[saleIndex].total_paid = +sales[saleIndex].payments
      .reduce((total, payment) => +payment.amount + total, 0)
      .toFixed(2);

    await this.createMany(sales);
    return sales[saleIndex];
  }

  async addItem(
    productToAdd: ProductDto,
    quantity: number,
    price?: number
  ): Promise<Entity> {
    const sales = await this.getAll();
    const saleIndex = sales.findIndex((_sale) => _sale.is_current);

    const itemIndex = sales[saleIndex].items.findIndex(
      (_item) => _item.product.id === productToAdd.product.id
    );

    if (
      itemIndex >= 0 &&
      sales[saleIndex].items[itemIndex].product.category.id !== 1
    ) {
      const newQuantity = +sales[saleIndex].items[itemIndex].quantity + 1;
      sales[saleIndex].items[itemIndex].quantity = newQuantity;
      sales[saleIndex].items[itemIndex].total = +(
        newQuantity * +(productToAdd.price_unit || 0)
      ).toFixed(2);
    } else {
      const { product, ...storeProduct } = productToAdd;
      sales[saleIndex].items.push({
        id: v4(),
        store_product_id: storeProduct.id,
        quantity,
        update_stock: true,
        product,
        storeProduct,
        total: +(price || productToAdd.price_unit || 0),
        created_at: moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
      });
    }

    sales[saleIndex].total_sold = +sales[saleIndex].items
      .reduce((total, item) => item.total + total, 0)
      .toFixed(2);

    await this.createMany(sales);
    return sales[saleIndex];
  }

  async decressItem(id: string): Promise<Entity> {
    const sales = await this.getAll();
    const saleIndex = sales.findIndex((_sale) => _sale.is_current);

    const itemIndex = sales[saleIndex].items.findIndex(
      (_item) => _item.id === id
    );

    const newQuantity = +sales[saleIndex].items[itemIndex].quantity - 1;

    if (
      sales[saleIndex].items[itemIndex].product.category.id === 1 ||
      newQuantity <= 0
    ) {
      sales[saleIndex].items = sales[saleIndex].items.filter(
        (_item) => _item.id !== id
      );
    } else {
      sales[saleIndex].items[itemIndex].quantity = newQuantity;
      sales[saleIndex].items[itemIndex].total =
        newQuantity *
        +(sales[saleIndex].items[itemIndex].storeProduct.price_unit || 0);
    }

    sales[saleIndex].total_sold = sales[saleIndex].items.reduce(
      (total, item) =>
        +(item.storeProduct?.price_unit || 0) * item.quantity + total,
      0
    );

    await this.createMany(sales);
    return sales[saleIndex];
  }

  async buildNewSale(): Promise<Entity> {
    const user = await userModel.get();
    const storeCash = await storeCashModel.getOne();
    return {
      id: v4(),
      user_id: user?.id,
      quantity: 0,
      change_amount: 0,
      type: 0,
      discount: 0,
      cash_id: storeCash?.cash_id,
      cash_history_id: storeCash?.history_id,
      is_online: storeCash?.history_id && storeCash?.cash_id ? true : false,
      is_current: true,
      is_integrated: false,
      to_integrate: false,
      total_paid: 0,
      total_sold: 0,
      items: [],
      payments: [],
    };
  }

  async getSaleFromApi(withClosedCash = false): Promise<SaleDto[]> {
    const is_online = await checkInternet();
    if (!is_online) {
      return [];
    }

    const currentCash = await storeCashModel.getOne();
    if (!currentCash) {
      return [];
    }

    if (!withClosedCash && !currentCash?.is_opened) {
      return [];
    }

    const { store_id, code } = currentCash;
    if (!store_id || !code) {
      return [];
    }

    const { data } = await midasApi.get(`/sales/${store_id}-${code}/history`);
    return data;
  }

  async deleteSaleFromApi(id: string): Promise<void> {
    const is_online = await checkInternet();
    if (!is_online) {
      return;
    }

    const currentCash = await storeCashModel.getOne();
    if (!currentCash || !currentCash.is_opened) {
      return;
    }

    const { store_id, code } = currentCash;
    if (!store_id || !code) {
      return;
    }

    await midasApi.delete(`/sales/${id}`);
  }
}

export default new Sale();
