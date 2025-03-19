import React, { Dispatch, SetStateAction } from "react";

import plus from "../../../../assets/totem/svg/plus.svg";
import minus from "../../../../assets/totem/svg/minus.svg";
import trash from "../../../../assets/totem/svg/trash.svg";
import cupom from "../../../../assets/totem/svg/cupom.svg";

import { getCategoryIcon } from "../../helpers/getCategoryIcon";

import { useSale } from "../../../../hooks/useSale";

import { ItemDto } from "../../../../models/dtos/item";
import { ProductVoucher } from "../../../../models/dtos/voucher";

import { AddSubItem, Container, OrderProduct } from "./styles";

interface IProps {
  useCupom?: boolean;
  addItemList: (item: ItemDto) => void;
  onDecressItemList: (item: ItemDto, totemNotification: boolean) => void;
  removeAllItems: (item: ItemDto) => void;
  setVisibleModalRemoveCupom?: Dispatch<SetStateAction<boolean>>;
}
const OrderProductList: React.FC<IProps> = ({
  useCupom,
  addItemList,
  onDecressItemList,
  removeAllItems,
  setVisibleModalRemoveCupom,
}) => {
  const { sale } = useSale();
  return (
    <Container>
      {useCupom &&
        sale.customerVoucher &&
        sale?.customerVoucher?.voucher?.products?.map((_product) => (
          <OrderProduct key={_product.id} sm={24} type={"cupom"}>
            <div className="order-item-content">
              <img src={cupom} className="order-item-image" />
              <span className="order-item-name">
                {"[CUPOM] " + _product.product_name}
              </span>
            </div>

            <div className="order-item-actions">
              <span>
                <img
                  className="order-item-image"
                  src={trash}
                  onClick={() =>
                    setVisibleModalRemoveCupom && setVisibleModalRemoveCupom(true)
                  }
                />
              </span>
              <span className="order-item-price">
                R${" "}
                {_product?.additional_value
                  ? "+ "
                  : "- " + _product?.price_sell?.replace(".", ",")}
              </span>
            </div>
          </OrderProduct>
        ))}
      {sale.items
        .map((item) => (
          <OrderProduct key={item.id} sm={24}>
            <div className="order-item-content">
              <img
                src={
                  item?.product?.upload_url
                    ? item?.product?.upload_url
                    : getCategoryIcon(item?.product?.category)
                }
                className="order-item-image"
              />
              <span className="order-item-name">{item.product.name}</span>
            </div>

            <div className="order-item-actions">
              <span>
                <img
                  className="order-item-image"
                  src={trash}
                  onClick={() => removeAllItems(item)}
                />
              </span>
              <span className="order-item-price">
                R$ {item.total?.toFixed(2).replace(".", ",")}
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
                    onClick={() => onDecressItemList(item, true)}
                  />
                </AddSubItem>
              )}
            </div>
          </OrderProduct>
        ))
        .reverse()}
    </Container>
  );
};

export default OrderProductList;
