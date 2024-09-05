import React, { useState, Dispatch, SetStateAction } from "react";
import moment from "moment";
import { v4 } from "uuid";

import bag from "../../../../assets/totem/svg/bag.svg";
import arrow_down from "../../../../assets/totem/svg/arrow_down.svg";
import bottle from "../../../../assets/totem/svg/bottle.svg";
import plus from "../../../../assets/totem/svg/plus.svg";
import minus from "../../../../assets/totem/svg/minus.svg";
import trash from "../../../../assets/totem/svg/trash.svg";

import { useSale } from "../../../../hooks/useSale";

import { ItemDto } from "../../../../models/dtos/item";
import { StoreProductDto } from "../../../../models/dtos/storeProduct";

import { Modal } from "antd";

import {
  Container,
  Button,
  ExtraProductList,
  ExtraProductCard,
  OrderProduct,
  Icon,
  Header,
  Body,
  Footer,
  ButtonRegister,
  ExtraProduct,
  ButtonFinalize,
  OrderProductList,
  AddSubItem,
} from "./styles";

interface IProps {
  setStep: Dispatch<SetStateAction<number>>;
  storeProducts: StoreProductDto[];
}

const Order: React.FC<IProps> = ({ setStep, storeProducts }) => {
  const { sale, onAddItem, onDecressItem } = useSale();
  const [fetchingBalanceWeight, setFetchingBalanceWeight] = useState(false);

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
          "O produto self-service não foi encontrado. Contate o atendente",
      });
      return;
    }

    if (!fetchingBalanceWeight) {
      setFetchingBalanceWeight(true);
      // window.Main.send("balance:get", ({ weight, error }) => {
      setFetchingBalanceWeight(false);
      // if (error) {
      //   Modal.info({
      //     title: "Falha de Leitura",
      //     content:
      //       "Erro ao obter dados da balança. Reconecte o cabo de dados na balança e no computador, feche o APP, reinicie a balança e abra o APP novamente",
      //   });
      //   return;
      // }
      // if (!weight) {
      //   Modal.info({
      //     title: "Falha de Leitura",
      //     content:
      //       "Não foi possível ler o peso de seu self-service. Retire o copo da balança e coloque-o novamente. Se o erro persistir, contate o atendente",
      //   });
      //   return;
      // }
      // const amount = +weight * +selfService?.price_unit;
      // onAddItem(selfService, +weight, +amount);
      const amount = +0.5 * +selfService?.price_unit;

      onAddItem(selfService, +0.5, +amount);
      // });
    }
  };

  const addItemList = async (item: ItemDto) => {
    const findProduct = storeProducts.find(
      (_product) => +_product.id === +item.store_product_id
    );
    onAddItem(findProduct, 1, +findProduct.price_unit);
  };

  const removeAllItems = async (item: ItemDto): Promise<void> => {
    for (let i = 0; i < item.quantity; i++) {
      await onDecressItem(item.id, true);
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
      <Body style={{ paddingTop: sale.items.length ? "0" : "3rem" }}>
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
                  <span>
                    <img src={trash} onClick={() => removeAllItems(item)} />
                  </span>
                  {item.product.category.id !== 1 && (
                    <AddSubItem>
                      <img
                        src={plus}
                        className="product-img-add"
                        onClick={() => addItemList(item)}
                      />
                      {item.quantity}
                      <img
                        src={minus}
                        className="product-img-sub"
                        onClick={() => onDecressItem(item.id, true)}
                      />
                    </AddSubItem>
                  )}
                </div>
              </OrderProduct>
            ))}
          </OrderProductList>
        </div>
        <div className="self-service-content">
          {!sale.items.length && (
            <span>Insira um item de cada vez sobre a balança</span>
          )}
          {sale.items.length &&
          sale.items.some((item) => item.product.category.id === 1) ? (
            <Button
              style={{ width: "100%", margin: "1.5rem 0" }}
              onClick={getWeightByBalance}
              loading={fetchingBalanceWeight}
            >
              <Icon src={plus} /> Fazer Nova Pesagem
            </Button>
          ) : (
            <ButtonRegister
              onClick={getWeightByBalance}
              loading={fetchingBalanceWeight}
            >
              <Icon src={plus} /> Registrar Pesagem
            </ButtonRegister>
          )}
        </div>
        <div className="extra-products-content">
          <div className="extra-product-title">
            <Icon src={bottle} /> Que tal adicionar uma água ou refrigerante?
          </div>
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
        <Button onClick={() => setStep(1)}>Cancelar Pedido</Button>
        {sale.items.length ? (
          <ButtonFinalize onClick={() => setStep(4)}>
            Concluir Pedido
          </ButtonFinalize>
        ) : (
          <></>
        )}
      </Footer>
    </Container>
  );
};

export default Order;
