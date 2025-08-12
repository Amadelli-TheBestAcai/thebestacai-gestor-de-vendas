import React, { Dispatch, SetStateAction } from "react";

import plus from "../../../../assets/totem/svg/plus.svg";
import minus from "../../../../assets/totem/svg/minus.svg";
import trash from "../../../../assets/totem/svg/trash.svg";
import cupom from "../../../../assets/totem/svg/cupom.svg";
import discount from "../../../../assets/totem/svg/discount.svg";

import { getCategoryIcon } from "../../helpers/getCategoryIcon";

import { useSale } from "../../../../hooks/useSale";
import { useSettings } from "../../../../hooks/useSettings";

import { ItemDto } from "../../../../models/dtos/item";

import { AddSubItem, Container, OrderProduct } from "./styles";

interface IProps {
  useCupom?: boolean;
  useDiscount?: boolean;
  addItemList: (item: ItemDto) => void;
  onDecressItemList: (item: ItemDto, totemNotification: boolean) => void;
  removeAllItems: (item: ItemDto) => void;
  setVisibleModalRemoveCupom?: Dispatch<SetStateAction<boolean>>;
}
const OrderProductList: React.FC<IProps> = ({
  useCupom,
  useDiscount,
  addItemList,
  onDecressItemList,
  removeAllItems,
  setVisibleModalRemoveCupom,
}) => {
  const { sale } = useSale();
  const { settings } = useSettings();
  return (
    <Container>
      {sale.items
        .map((item) => (
          <OrderProduct key={item.id} sm={24}>
            <div className="order-item-content">
              <span className="order-item-name">
                {item.product.id !== 1
                  ? `${item.quantity}x ${item.product.name}`
                  : item.product.name}
              </span>
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
      {useCupom &&
        sale.customerVoucher &&
        sale?.customerVoucher?.voucher?.products?.map((_product) => (
          <OrderProduct key={_product.id} sm={24} type={"cupom"}>
            <div className="order-item-content">
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
                    setVisibleModalRemoveCupom &&
                    setVisibleModalRemoveCupom(true)
                  }
                />
              </span>
              <span className="order-item-price">
                R${" "}
                {_product?.additional_value
                  ? "+ "
                  : "- " +
                    (+_product?.price_sell || 0)?.toFixed(2)?.replace(".", ",")}
              </span>
            </div>
          </OrderProduct>
        ))}
      {useDiscount &&
        sale?.discount &&
        settings?.should_active_discount_storekeeper && (
          <OrderProduct type={"cupom"}>
            <div className="order-item-content">
              <span className="order-item-name">
                {"[-10%] Desconto de Lojista"}
              </span>
            </div>

            <div className="order-item-actions">
              <span
                className="order-item-price"
                style={{ marginRight: "2.5rem" }}
              >
                R$ {"- " + (sale?.discount || 0)?.toFixed(2)?.replace(".", ",")}
              </span>
            </div>
          </OrderProduct>
        )}
    </Container>
  );
};

export default OrderProductList;
