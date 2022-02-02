import { BaseRepository } from "../repository/baseRepository";
import { IBaseRepository } from "../repository/baseRepository.interface";
import { Entity as ProductDto } from "./product";
import userModel from "./user";
import storeCashModel from "./storeCash";
import productModel from "./product";
import storeModel from "./store";
import { v4 } from "uuid";
import moment from "moment";
import { checkInternet } from "../providers/internetConnection";
import midasApi from "../providers/midasApi";
import odinApi from "../providers/odinApi";
import apiNfce from "../providers/apiNfe";
import { AppSaleDTO } from "./dtos/appSale";
import { salesFormaterToIntegrate } from "../helpers/salesFormaterToIntegrate";
import { NfeDTO } from "./dtos/nfe";

import env from "../providers/env.json";
const ambiente = env.NFCe_AMBIENTE;

export type Entity = {
  id: string;
  name?: string;
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
  private notIntegratedQueueRepository: IBaseRepository<Entity>;
  public integrateQueueRepository: IBaseRepository<Entity>;
  public stepSaleRepository: IBaseRepository<Entity>;
  public deliverySaleRepository: IBaseRepository<Entity>;
  constructor(storageName = "Sale") {
    super(storageName);
    this.notIntegratedQueueRepository = new BaseRepository<Entity>(
      "Not_Integrated_Sale"
    );
    this.integrateQueueRepository = new BaseRepository<Entity>(
      "Integrated_Sale"
    );
    this.stepSaleRepository = new BaseRepository<Entity>("Step_Sale");
    this.deliverySaleRepository = new BaseRepository<Entity>("Delivery_Sale");
  }

  async getCurrent(): Promise<Entity> {
    const sales = await this.getAll();
    const currentSale = sales.find((_sale) => _sale.is_current);
    if (currentSale) {
      return currentSale;
    } else {
      const newSale: Entity = await this.buildNewSale();
      await this.create(newSale);
      return newSale;
    }
  }

  async finishSale(payload: Entity, fromDelivery?: boolean): Promise<void> {
    payload.is_current = false;
    payload.to_integrate = true;

    if (fromDelivery) {
      await this.deliverySaleRepository.deleteById(payload.id);
    } else {
      await this.deleteById(payload.id);
    }
    await this.notIntegratedQueueRepository.create(payload);

    await this.onlineIntegration();
  }

  async addPayment(amount: number, type: number): Promise<Entity> {
    const sale = await this.getCurrent();

    sale.payments.push({
      id: v4(),
      amount,
      type,
      created_at: moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
    });

    sale.total_paid = +sale.payments
      .reduce((total, payment) => +payment.amount + total, 0)
      .toFixed(2);

    await this.update(sale.id, sale);
    return sale;
  }

  async deletePayment(id: string): Promise<Entity> {
    const sale = await this.getCurrent();

    sale.payments = sale.payments.filter((_payment) => _payment.id !== id);

    sale.total_paid = +sale.payments
      .reduce((total, payment) => +payment.amount + total, 0)
      .toFixed(2);

    await this.update(sale.id, sale);
    return sale;
  }

  async createStepSale(name: string): Promise<Entity> {
    const currentSale = await this.getCurrent();

    currentSale.name = name;
    currentSale.is_current = false;

    await this.deleteById(currentSale.id);
    await this.stepSaleRepository.create(currentSale);

    const newSale: Entity = await this.buildNewSale();
    await this.create(newSale);

    return newSale;
  }

  async getAllStepSales(): Promise<Entity[]> {
    const stepSales = await this.stepSaleRepository.getAll();

    return stepSales;
  }

  async recouverStepSales(id: string): Promise<Entity> {
    const stepSale = (await this.stepSaleRepository.getById(id)) as Entity;

    const transferItem = async (storeProductId: number, quantity: number) => {
      const product = (await productModel.getById(
        storeProductId
      )) as ProductDto;
      await this.addItem(product, quantity);
    };

    await stepSale.items.reduce(async (previousItem, nextItem) => {
      await previousItem;
      return transferItem(nextItem.store_product_id, nextItem.quantity);
    }, Promise.resolve());

    await this.stepSaleRepository.deleteById(id);

    return await this.getCurrent();
  }

  async addItem(
    productToAdd: ProductDto,
    quantity: number,
    price?: number
  ): Promise<Entity> {
    const sale = await this.getCurrent();

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
        update_stock: true,
        product,
        storeProduct,
        total: +(price || productToAdd.price_unit || 0) * quantity,
        created_at: moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
      });
    }

    sale.total_sold = +sale.items
      .reduce((total, item) => item.total + total, 0)
      .toFixed(2);

    sale.quantity = sale.items.reduce(
      (total, item) =>
        +item.product.category.id === 1 ? 1 : item.quantity + total,
      0
    );

    await this.update(sale.id, sale);
    return sale;
  }

  async decressItem(id: string): Promise<Entity> {
    const sale = await this.getCurrent();

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

    await this.update(sale.id, sale);
    return sale;
  }

  async buildNewSale(withPersistence = true): Promise<Entity> {
    const user = await userModel.get();
    const storeCash = await storeCashModel.getOne();

    const newSale = {
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
    if (withPersistence) {
      await this.create(newSale);
    }
    return newSale;
  }

  async getSaleFromApi(withClosedCash = false): Promise<Entity[]> {
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

  async getSaleFromApp(): Promise<AppSaleDTO[]> {
    const is_online = await checkInternet();
    if (!is_online) {
      return [];
    }

    const currentCash = await storeCashModel.getOne();
    if (!currentCash || !currentCash?.is_opened) {
      throw new Error("Caixa fechado");
    }

    const { store_id } = currentCash;
    if (!store_id) {
      throw new Error("Id da loja não encontrado");
    }

    const {
      data: { content },
    } = await odinApi.get(`/app_sale/${store_id}/toIntegrate`);

    return content;
  }

  async onlineIntegration(): Promise<void> {
    const is_online = await checkInternet();
    if (!is_online) {
      return;
    }
    try {
      const sales: Entity[] = await this.notIntegratedQueueRepository.getAll();

      const salesOnline: Entity[] = sales.filter((_sale) => _sale.is_online);

      const payload = salesFormaterToIntegrate(salesOnline);

      if (payload.length) {
        await midasApi.post("/sales", payload);
      }

      await this.notIntegratedQueueRepository.clear();

      await this.integrateQueueRepository.createMany(salesOnline);
    } catch (error) {
      console.log(error);
    }
  }

  async emitNfce(
    nfe: NfeDTO,
    saleIdToUpdate?: number
  ): Promise<{ error: boolean; message: string }> {
    const hasInternet = await checkInternet();
    if (!hasInternet) {
      return {
        error: true,
        message: "Dispositivo sem conexão",
      };
    }

    const store = await storeModel.getOne();

    const storeCash = await storeCashModel.getOne();

    if (!storeCash || !storeCash.is_opened) {
      return {
        error: true,
        message:
          "Caixa atualmente fechado. Abra o caixa para realizar a emissão",
      };
    }

    let sale = {
      cash_code: storeCash.code,
      store_id: store?.company_id,
      cash_id: storeCash.cash_id,
      cash_history_id: storeCash.history_id,
      type: "STORE",
      discount: 0,
      total: 0,
      quantity: nfe.produtos.length,
      to_integrate: false,
      is_current: false,
      nfce_id: null,
      nfce_url: null,
    };

    try {
      console.log({
        nfce_payload: {
          ambiente,
          idEmpresa: store?.company_id,
          ...nfe,
        },
      });
      const {
        data: {
          erro: nfe_erro,
          url: nfce_url,
          id: nfce_id,
          message: nfe_message,
          erros: nfe_erros,
        },
      } = await apiNfce.post("/emitirNFCe", {
        ambiente,
        idEmpresa: store?.company_id,
        ...nfe,
      });

      console.log({ nfe_erro });
      if (nfe_erro || nfe_erros?.length) {
        return {
          error: true,
          message: nfe_message || nfe_erros.join(", "),
        };
      }
      if (!nfce_url || !nfce_id) {
        return {
          error: true,
          message:
            "Serviço temporariamente indisponível. Tente novamente mais tarde",
        };
      }
      sale = {
        ...sale,
        nfce_id,
        nfce_url,
      };
    } catch (error) {
      return {
        error: true,
        message: "",
        // message: error?.response?.data?.mensagem.includes("XML")
        //   ? "Produtos com dados tributários inválidos ou serviço indisponível. Contate o suporte"
        //   : error?.response?.data?.mensagem
        //   ? error.response.data.mensagem
        //   : "Serviço temporariamente indisponível. Tente novamente mais tarde",
      };
    }

    const saleResponse = await this.buildNewSale();
    if (!saleIdToUpdate) {
      try {
        await Promise.all(
          nfe.produtos.map(async (produto) => {
            const product = await productModel.getById(produto.codigo);

            const payload = {
              name: product?.product.name,
              price_unit: product?.product?.price_sell,
              product_id: product?.product_id,
              product_store_id: product?.store_id,
              category_id: product?.product.category_id,
              quantity: produto.quantidadeComercial,
              sale_id: v4(),
              items: product?.product,
              // total: produto.quantidadeComercial * +product?.product.price_sell,
            };

            // await this.addItem(payload.items, payload.quantity);
          })
        );

        await this.update(saleResponse.id, {
          to_integrate: true,
        });

        await this.onlineIntegration();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await midasApi.put(`/sales/${saleIdToUpdate}`, {
          nfce_id: sale.nfce_id,
          nfce_url: sale.nfce_url,
        });
      } catch {
        return {
          error: true,
          message: `Nfce emita mas houve falha ao vincular na venda, solicite suporte informando a chave gerada: ${sale.nfce_id}`,
        };
      }
    }

    return {
      error: false,
      message: "NFCe emitida com sucesso",
    };
  }
}

export default new Sale();
