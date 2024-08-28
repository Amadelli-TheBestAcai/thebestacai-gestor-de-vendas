import React, { useState, Dispatch, SetStateAction } from "react";
import moment from "moment";
import { v4 } from "uuid";

import { Modal } from "antd";

import { SaleDto } from "../../../../models/dtos/sale";
import { StoreProductDto } from "../../../../models/dtos/storeProduct";

import bag from "../../../../assets/totem/svg/bag.svg";
import arrow_down from "../../../../assets/totem/svg/arrow_down.svg";
import bottle from "../../../../assets/totem/svg/bottle.svg";
import plus from "../../../../assets/totem/svg/plus.svg";

import {
  Container,
  Button,
  ExtraProductList,
  ExtraProductCard,
  OrderProduct,
  TrashIcon,
  Icon,
  Header,
  Body,
  Footer,
  ButtonRegister,
  ExtraProduct,
  ButtonCancel,
  OrderProductList,
} from "./styles";

interface IProps {
  setStep: Dispatch<SetStateAction<number>>;
  sale: SaleDto | null;
  setSale: Dispatch<SetStateAction<SaleDto | null>>;
  storeProducts: StoreProductDto[];
}

const Order: React.FC<IProps> = ({ setStep, sale, setSale, storeProducts }) => {
  const [fetchingBalanceWeight, setFetchingBalanceWeight] = useState(false);

  const onAddItem = (
    productToAdd: StoreProductDto,
    quantity: number,
    price: number
  ) => {
    const saleToUpdate = { ...sale };

    const itemIndex = saleToUpdate.items.findIndex(
      (_item) =>
        !_item.customer_reward_id &&
        _item.product?.id === productToAdd.product?.id
    );

    if (
      itemIndex >= 0 &&
      saleToUpdate.items[itemIndex].product?.category.id !== 1
    ) {
      const newQuantity = +saleToUpdate.items[itemIndex].quantity + quantity;
      saleToUpdate.items[itemIndex].quantity = newQuantity;
      saleToUpdate.items[itemIndex].total = +(
        newQuantity * +(productToAdd?.price_unit || 0)
      ).toFixed(2);
    } else {
      const { product, ...storeProduct } = productToAdd;
      saleToUpdate.items.push({
        id: v4(),
        store_product_id: storeProduct.id,
        quantity,
        update_stock: product?.category.id !== 1 ? true : false,
        product,
        storeProduct,
        total: price ? price : +(productToAdd.price_unit || 0) * quantity,
        created_at: moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
      });
    }

    saleToUpdate.total_sold = +saleToUpdate.items
      .reduce((total, item) => item.total + total, 0)
      .toFixed(2);

    if (saleToUpdate.customerVoucher?.voucher?.products?.length)
      saleToUpdate.customerVoucher?.voucher?.products.forEach(
        (product) => (saleToUpdate.total_sold -= +product.price_sell)
      );

    saleToUpdate.quantity = saleToUpdate.items.reduce(
      (total, item) =>
        +item.product?.category.id === 1 ? 1 + total : item.quantity + total,
      0
    );

    setSale(saleToUpdate);
  };

  const onRemoveItem = (id: string) => {
    const saleToUpdate = { ...sale };

    const itemIndex = saleToUpdate.items.findIndex((_item) => _item.id === id);

    const newQuantity = +saleToUpdate.items[itemIndex]?.quantity - 1;

    if (
      saleToUpdate.items[itemIndex]?.product.category.id === 1 ||
      newQuantity <= 0
    ) {
      saleToUpdate.items = saleToUpdate.items.filter(
        (_item) => _item.id !== id
      );
    } else {
      saleToUpdate.items[itemIndex].quantity = newQuantity;
      saleToUpdate.items[itemIndex].total =
        newQuantity *
        +(saleToUpdate.items[itemIndex].storeProduct.price_unit || 0);
    }

    saleToUpdate.total_sold = +saleToUpdate.items
      .reduce((total, item) => item.total + total, 0)
      .toFixed(2);

    if (saleToUpdate.customerVoucher?.voucher?.products?.length)
      saleToUpdate.customerVoucher?.voucher?.products.forEach(
        (product) => (saleToUpdate.total_sold -= +product.price_sell)
      );

    saleToUpdate.quantity = saleToUpdate.items.reduce(
      (total, item) =>
        +item.product?.category.id === 1 ? 1 + total : item.quantity + total,
      0
    );

    setSale(saleToUpdate);
  };

  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const getWeightByBalance = async (): Promise<void> => {
    await sleep(1500);

    const selfService = storeProducts.find(
      (_product) => _product.product.category_id === 1
    );

    if (!selfService) {
      Modal.info({
        title: "Self service não encontrado",
        content:
          "O produto self-service não vfoi encontrado. Contate o atendente",
      });
      return;
    }

    if (!fetchingBalanceWeight) {
      setFetchingBalanceWeight(true);
      window.Main.send("balance:get", ({ weight, error }) => {
        setFetchingBalanceWeight(false);
        if (error) {
          Modal.info({
            title: "Falha de Leitura",
            content:
              "Erro ao obter dados da balança. Reconecte o cabo de dados na balança e no computador, feche o APP, reinicie a balança e abra o APP novamente",
          });
          return;
        }
        if (!weight) {
          Modal.info({
            title: "Falha de Leitura",
            content:
              "Não foi possível ler o peso de seu self-service. Retire o copo da balança e coloque-o novamente. Se o erro persistir, contate o atendente",
          });
          return;
        }
        const amount = +weight * +selfService?.price_unit;

        onAddItem(selfService, +weight, +amount);
      });
    }
  };

  return (
    <Container>
      <Header>
        <div className="bag-content">
          <Icon src={bag} />
          <span>Sua Sacola</span>
        </div>
        <div className="price-content">
          <span>R$ {(sale?.total_sold || 0).toFixed(2).replace(".", ",")}</span>
          <Icon src={arrow_down} />
        </div>
      </Header>
      <Body>
        <div className="order-list-content">
          <OrderProductList>
            {sale.items.map((item) => (
              <OrderProduct key={item.id} sm={24}>
                <div className="order-item-content">
                  <img src={bottle} className="order-item-image" />
                  <div className="order-item-info">
                    <span className="order-item-name">{item.product.name}</span>
                    <span className="order-item-price">
                      R$ {item.total?.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>
                <div className="order-item-actions">
                  <div className="order-item-quantity">{item.quantity}</div>
                  <span>
                    <TrashIcon onClick={() => onRemoveItem(item.id)} />
                  </span>
                </div>
              </OrderProduct>
            ))}
          </OrderProductList>
        </div>
        <div className="self-service-content">
          {sale.items.length === 0 && (
            <span>Insira um item de cada vez sobre a balança</span>
          )}
          <ButtonRegister
            onClick={getWeightByBalance}
            loading={fetchingBalanceWeight}
          >
            <Icon src={plus} /> REGISTRAR PESAGEM
          </ButtonRegister>
        </div>
        <div className="extra-products-content">
          <span className="extra-product-title">
            <Icon src={bottle} /> Que tal adicionar uma água ou refrigerante?
          </span>
          <ExtraProductList gutter={[6, 40]}>
            {storeProducts
              .filter((storeProduct) => storeProduct.product.category_id === 2)
              .map((storeProduct) => (
                <ExtraProduct sm={6} key={storeProduct.id}>
                  <ExtraProductCard
                    key={storeProduct.id}
                    onClick={() =>
                      onAddItem(storeProduct, 1, +storeProduct.price_unit)
                    }
                  >
                    <img className="product-img-add" src={plus} />
                    <img src={bottle} />

                    <span className="product-name">
                      {storeProduct.product.name}
                    </span>
                    <span className="product-price">
                      R$
                      {storeProduct.price_unit?.replace(".", ",")} /{" "}
                      {storeProduct?.unity_taxable || ""}
                    </span>
                  </ExtraProductCard>
                </ExtraProduct>
              ))}
          </ExtraProductList>
        </div>
      </Body>
      <Footer
        style={{
          justifyContent: sale.items.length ? "space-between" : "center",
        }}
      >
        <ButtonCancel onClick={() => setStep(1)}>Cancelar Pedido</ButtonCancel>
        {sale.items.length ? (
          <Button onClick={() => setStep(4)}>Concluir Pedido</Button>
        ) : (
          <></>
        )}
      </Footer>
    </Container>
  );
};

export default Order;
