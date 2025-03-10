import React, { useState, Dispatch, SetStateAction, useEffect } from "react";

import bag from "../../../../assets/totem/svg/bag.svg";
import plus from "../../../../assets/totem/svg/plus.svg";
import minus from "../../../../assets/totem/svg/minus.svg";
import trash from "../../../../assets/totem/svg/trash.svg";
import bottle from "../../../../assets/totem/svg/bottle.svg";
import self_service from "../../../../assets/totem/svg/self_service.svg";
import totem_order_flag from "../../../../assets/totem/img/totem_order_flag.png";

import { useSale } from "../../../../hooks/useSale";

import { ItemDto } from "../../../../models/dtos/item";
import { StoreProductDto } from "../../../../models/dtos/storeProduct";

import ModalInfo from "../ModalInfo";

import { notification } from "antd";

import {
  Container,
  Button,
  ExtraProductList,
  ExtraProductCard,
  OrderProduct,
  Icon,
  Body,
  Footer,
  ButtonRegister,
  ExtraProduct,
  ButtonFinalize,
  OrderProductList,
  AddSubItem,
  MenuCategory,
  CardCategoryMenu,
} from "./styles";

interface Category {
  id: number;
  name: string;
  sort?: number;
  created_at?: string;
  deleted_at?: string;
}
interface IProps {
  stepChange: (step: number) => void;
  storeProducts: StoreProductDto[];
  taggedStoreProducts: StoreProductDto[];
  cancelSale: () => void;
}

const Order: React.FC<IProps> = ({
  stepChange,
  storeProducts,
  cancelSale,
  taggedStoreProducts,
}) => {
  const { sale, onAddItem, onDecressItem } = useSale();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetchingBalanceWeight, setFetchingBalanceWeight] =
    useState<boolean>(false);

  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  useEffect(() => {
    const _categories = getCategories();

    if (_categories) {
      setCategories(_categories);
      setSelectedCategory(_categories[0].id || 0);
    }
  }, []);

  const getCategories = () => {
    const _categories: number[] = [];

    const _categoriesList = storeProducts
      .filter(
        (_product) =>
          _product.product.category.id !== 1 &&
          taggedStoreProducts.some(
            (_taggedProduct) => _taggedProduct.id === _product.id
          )
      )
      .map((_product) => {
        const category = _product.product.category;
        if (!_categories.includes(category.id)) {
          _categories.push(category.id);
          return category;
        }
        return null;
      })
      .filter((category) => category !== null);

    return _categoriesList;
  };

  const getWeightByBalance = async (): Promise<void> => {
    setFetchingBalanceWeight(true);
    await sleep(1500);

    const selfService = storeProducts.find(
      (_product) => _product.product.category_id === 1
    );

    if (!selfService) {
      notification.info({
        message: "Self service não encontrado",
        description:
          "O produto self-service não foi encontrado. Contate o atendente",
        duration: 5,
        className: "notification-totem",
      });
      setFetchingBalanceWeight(false);
      return;
    }

    window.Main.send("balance:get", ({ weight, error }) => {
      setFetchingBalanceWeight(false);
      if (error) {
        notification.info({
          message: "Falha de Leitura. Erro ao obter dados da balança.",
          description:
            "Reconecte o cabo de dados na balança e no computador, feche o APP, reinicie a balança e abra o APP novamente",
          duration: 5,
          className: "notification-totem",
        });
        return;
      }
      if (!weight) {
        notification.info({
          message:
            "Falha de Leitura. Não foi possível ler o peso de seu self-service.",
          description:
            "Retire o copo da balança e coloque-o novamente. Se o erro persistir, contate o atendente",
          duration: 5,
          className: "notification-totem",
        });
        return;
      }
      const amount = +weight * +selfService?.price_unit;
      onAddItem(selfService, +weight, +amount);
    });
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
    <>
      <Container>
        <MenuCategory onClick={() => console.log(taggedStoreProducts)}>
          <img src={totem_order_flag} />
          {categories.map((_category) => (
            <CardCategoryMenu
              active={selectedCategory === _category.id}
              onClick={() => setSelectedCategory(_category.id)}
            >
              <span>{_category?.name}</span>
            </CardCategoryMenu>
          ))}
        </MenuCategory>
        <Body>
          <span className="title">
            Bem-vindo a The Best Açaí!
            <br />O que vai querer hoje?
          </span>

          <div className="self-service-content">
            <div className="title">
              {" "}
              <Icon src={self_service} /> Self-Service
            </div>
            {sale.items.length &&
            sale.items.some((item) => item.product.category.id === 1) ? (
              <ButtonRegister
                style={{ width: "100%", margin: "1.5rem 0" }}
                onClick={getWeightByBalance}
                loading={fetchingBalanceWeight}
              >
                <Icon src={plus} /> Adicionar Nova Pesagem
              </ButtonRegister>
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
            <div className="extra-products-title">
              <Icon src={bottle} />{" "}
              <span>
                {
                  categories.find(
                    (_category) => _category.id === selectedCategory
                  )?.name
                }
              </span>
            </div>
            <ExtraProductList gutter={[6, 40]} size={sale?.items?.length}>
              {storeProducts
                .filter(
                  (storeProduct) =>
                    storeProduct.product.category_id === selectedCategory &&
                    taggedStoreProducts.some(
                      (_taggedProduct) => _taggedProduct.id === storeProduct.id
                    ) &&
                    storeProduct.product.category_id !== 1
                )
                .sort((a, b) => a.product.name.localeCompare(b.product.name))
                .map((storeProduct) => (
                  <ExtraProduct sm={8} key={storeProduct.id}>
                    <ExtraProductCard
                      key={storeProduct.id}
                      onClick={() =>
                        onAddItem(storeProduct, 1, +storeProduct.price_unit)
                      }
                    >
                      <img className="product-img-add" src={plus} />
                      <img
                        className="product-img"
                        src={
                          storeProduct?.product?.upload_url
                            ? storeProduct?.product?.upload_url?.toString()
                            : bottle
                        }
                      />

                      <span className="product-name">
                        {storeProduct.product.name}
                      </span>
                      <span className="product-price">
                        R$
                        {storeProduct.price_unit?.replace(".", ",")}
                      </span>
                    </ExtraProductCard>
                  </ExtraProduct>
                ))}
            </ExtraProductList>
          </div>

          {/* <div className="order-list-content">
            <OrderProductList>
              {sale.items
                .map((item) => (
                  <OrderProduct key={item.id} sm={24}>
                    <div className="order-item-content">
                      <img
                        src={
                          item.product.category.id === 1
                            ? selfservice
                            : item?.product?.upload_url
                            ? item?.product?.upload_url
                            : bottle
                        }
                        className="order-item-image"
                      />
                      <div className="order-item-info">
                        <span className="order-item-name">
                          {item.product.name}
                        </span>
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
                ))
                .reverse()}
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
                <Icon src={plus} /> Adicionar Nova Pesagem
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
            <ExtraProductList gutter={[6, 40]} size={sale?.items?.length}>
              {storeProducts
                .filter(
                  (storeProduct) => storeProduct.product.category_id === 2
                )
                .sort((a, b) => a.product.name.localeCompare(b.product.name))
                .map((storeProduct) => (
                  <ExtraProduct sm={6} key={storeProduct.id}>
                    <ExtraProductCard
                      key={storeProduct.id}
                      onClick={() =>
                        onAddItem(storeProduct, 1, +storeProduct.price_unit)
                      }
                    >
                      <img className="product-img-add" src={plus} />
                      <img
                        className="product-img"
                        src={
                          storeProduct?.product?.upload_url
                            ? storeProduct?.product?.upload_url?.toString()
                            : bottle
                        }
                      />

                      <span className="product-name">
                        {storeProduct.product.name}
                      </span>
                      <span className="product-price">
                        R$
                        {storeProduct.price_unit?.replace(".", ",")}
                      </span>
                    </ExtraProductCard>
                  </ExtraProduct>
                ))}
            </ExtraProductList>
            <div className="extra-product-title">Confira nossos produtos!</div>
            <ExtraProductList gutter={[6, 40]} size={sale?.items?.length}>
              {storeProducts
                .filter(
                  (storeProduct) =>
                    ![1, 2].some(
                      (category) =>
                        category === storeProduct.product.category_id
                    )
                )
                .filter((storeProduct) =>
                  taggedStoreProducts.some(
                    (_taggedStoreProduct) =>
                      _taggedStoreProduct.product_id === storeProduct.product_id
                  )
                )
                .sort((a, b) => a.product.name.localeCompare(b.product.name))
                .map((storeProduct) => (
                  <ExtraProduct sm={6} key={storeProduct.id}>
                    <ExtraProductCard
                      key={storeProduct.id}
                      onClick={() =>
                        onAddItem(storeProduct, 1, +storeProduct.price_unit)
                      }
                    >
                      <img className="product-img-add" src={plus} />
                      <img
                        className="product-img"
                        src={
                          storeProduct?.product?.upload_url
                            ? storeProduct?.product?.upload_url?.toString()
                            : bottle
                        }
                      />

                      <span className="product-name">
                        {storeProduct.product.name}
                      </span>
                      <span className="product-price">
                        R$
                        {storeProduct.price_unit?.replace(".", ",")}
                      </span>
                    </ExtraProductCard>
                  </ExtraProduct>
                ))}
            </ExtraProductList>
          </div> */}
        </Body>
      </Container>
      <Footer>
        {/* <Button onClick={() => setVisibleModal(true)}>Cancelar Pedido</Button>
        {sale.items.length ? (
          <ButtonFinalize
            onClick={() => stepChange(4)}
            loading={fetchingBalanceWeight}
          >
            Avançar
          </ButtonFinalize>
        ) : (
          <></>
        )} */}
      </Footer>
      <ModalInfo
        visible={visibleModal}
        setVisible={setVisibleModal}
        cancelSale={cancelSale}
      />
    </>
  );
};

export default Order;
