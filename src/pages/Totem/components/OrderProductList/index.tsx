import React from "react";

import plus from "../../../../assets/totem/svg/plus.svg";
import minus from "../../../../assets/totem/svg/minus.svg";
import trash from "../../../../assets/totem/svg/trash.svg";

import { getCategoryIcon } from "../../helpers/getCategoryIcon";

import { useSale } from "../../../../hooks/useSale";

import { ItemDto } from "../../../../models/dtos/item";

import { AddSubItem, Container, OrderProduct } from "./styles";

interface IProps {
  addItemList: (item: ItemDto) => void;
  onDecressItem: (item: string, totemNotification: boolean) => void;
  removeAllItems: (item: ItemDto) => void;
}
const OrderProductList: React.FC<IProps> = ({
  addItemList,
  onDecressItem,
  removeAllItems,
}) => {
  const { sale } = useSale();
  return (
    <Container>
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
                    onClick={() => onDecressItem(item.id, true)}
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
