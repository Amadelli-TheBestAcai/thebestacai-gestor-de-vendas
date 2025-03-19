import React, { useState, useEffect } from "react";

import bag from "../../../../assets/totem/svg/bag.svg";
import plus from "../../../../assets/totem/svg/plus.svg";
import check from "../../../../assets/totem/svg/check.svg";
import bottle from "../../../../assets/totem/svg/bottle.svg";
import arrow_left from "../../../../assets/totem/svg/arrow_left.svg";
import self_service from "../../../../assets/totem/svg/self_service.svg";
import totem_order_flag from "../../../../assets/totem/img/totem_order_flag.png";

import { getCategoryIcon } from "../../helpers/getCategoryIcon";

import { useSale } from "../../../../hooks/useSale";

import { ItemDto } from "../../../../models/dtos/item";
import { StoreProductDto } from "../../../../models/dtos/storeProduct";

import ModalSaleCancel from "../ModalSaleCancel";
import ProductCard from "../ProductCard";
import OrderProductList from "../OrderProductList";

import { notification } from "antd";

import {
  Container,
  Button,
  ExtraProductList,
  Icon,
  Body,
  Footer,
  ButtonRegister,
  ExtraProduct,
  ButtonFinalize,
  MenuCategory,
  CardCategoryMenu,
  ButtonReturn,
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
  cancelSale: () => void;
}

const Order: React.FC<IProps> = ({ stepChange, storeProducts, cancelSale }) => {
  const { sale, onAddItem, onDecressItem } = useSale();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetchingBalanceWeight, setFetchingBalanceWeight] =
    useState<boolean>(false);
  const [loadingButtonRegister, setLoadingButtonRegister] =
    useState<boolean>(false);

  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  useEffect(() => {
    const _categories = getCategories();

    if (_categories) {
      setCategories(_categories);
      setSelectedCategory(
        _categories.find((_category) =>
          _category?.name?.toLowerCase()?.includes("bebida")
        )?.id ||
          _categories[0]?.id ||
          0
      );
    }
  }, []);

  const getCategories = () => {
    const _categories: number[] = [];

    const _categoriesList = storeProducts
      .filter((_product) => _product.product.category.id !== 1)
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
      (_product) => _product?.product?.id === 1
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

      colorChange();
    });
  };

  const colorChange = async () => {
    setLoadingButtonRegister(() => true);
    await sleep(2000);
    setLoadingButtonRegister(() => false);
  };

  const addItemList = async (item: ItemDto) => {
    const findProduct = storeProducts.find(
      (_product) => +_product.id === +item.store_product_id
    );
    onAddItem(findProduct, 1, +findProduct.price_unit);
  };

 const onDecressItemList = async (item: ItemDto, totemNotification: boolean) =>{
    await onDecressItem(item.id, totemNotification);
  }

  const removeAllItems = async (item: ItemDto): Promise<void> => {
    for (let i = 0; i < item.quantity; i++) {
      await onDecressItem(item.id, true);
    }
  };

  return (
    <>
      <Container>
        <MenuCategory>
          <div className="body-menu">
            <img src={totem_order_flag} />
            {categories.map((_category) => (
              <CardCategoryMenu
                key={_category.id}
                active={selectedCategory === _category.id}
                onClick={() => setSelectedCategory(_category.id)}
              >
                <img src={getCategoryIcon(_category)} />
                <span>{_category?.name}</span>
              </CardCategoryMenu>
            ))}
          </div>
          {!sale.items.length && (
            <ButtonReturn onClick={() => stepChange(2)}>
              <img src={arrow_left} /> <span>Voltar</span>
            </ButtonReturn>
          )}
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

            <ButtonRegister
              onClick={getWeightByBalance}
              loading={fetchingBalanceWeight}
              loadingRegister={loadingButtonRegister}
            >
              {loadingButtonRegister ? (
                <Icon src={check} />
              ) : (
                !fetchingBalanceWeight && <Icon src={plus} />
              )}
              {fetchingBalanceWeight
                ? "Registrando Pesagem"
                : sale?.items?.length &&
                  sale?.items?.some((item) => item?.product?.id === 1)
                ? !loadingButtonRegister
                  ? "Adicionar Nova Pesagem"
                  : "Pesagem concluída"
                : "Registrar Pesagem"}
            </ButtonRegister>
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
                    storeProduct.product.category_id !== 1
                )
                .sort((a, b) => a.product.name.localeCompare(b.product.name))
                .map((storeProduct) => (
                  <ExtraProduct sm={8} key={storeProduct.id}>
                    <ProductCard
                      key={storeProduct.id}
                      storeProduct={storeProduct}
                    />
                  </ExtraProduct>
                ))}
            </ExtraProductList>
          </div>
        </Body>
      </Container>
      <Footer>
        <div className="order-list-footer">
          <div className="order-title-footer">
            <img src={bag} /> Sua sacola
          </div>
          <OrderProductList
            addItemList={addItemList}
            onDecressItemList={onDecressItemList}
            removeAllItems={removeAllItems}
          />
        </div>
        <div className="action-footer">
          <div className="order-title-footer">
            <span className="title-strong">
              R${" "}
              {sale.items
                .reduce((total, item) => total + +(item.total || 0), 0)
                .toFixed(2)}
            </span>
          </div>
          {sale.items.length ? (
            <ButtonFinalize
              onClick={() => stepChange(4)}
              loading={fetchingBalanceWeight}
            >
              Finalizar Pedido
            </ButtonFinalize>
          ) : (
            <></>
          )}
          <Button onClick={() => setVisibleModal(true)}>Cancelar Pedido</Button>
        </div>
      </Footer>
      <ModalSaleCancel
        visible={visibleModal}
        setVisible={setVisibleModal}
        cancelSale={cancelSale}
      />
    </>
  );
};

export default Order;
