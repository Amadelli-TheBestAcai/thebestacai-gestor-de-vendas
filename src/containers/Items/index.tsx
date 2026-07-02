import React from "react";

import { useSale } from "../../hooks/useSale";

import EmptyImg from "../../assets/svg/addCart.svg";
import { Empty } from "antd";
import { GiftOutlined } from "@ant-design/icons";

import Item from "../../components/Item";

import {
  Container,
  Header,
  Column,
  ItemContainer,
  ItemContent,
  EmptyContainer,
  CouponRow,
  CouponLeft,
  CouponTag,
  CouponName,
  CouponValue,
} from "./styles";

const Items: React.FC = () => {
  const { sale } = useSale();

  const giftVoucher =
    sale?.customerVoucher?.voucher?.voucher_type === "gift_by_subtotal"
      ? sale.customerVoucher.voucher
      : null;
  const giftConfig: any = giftVoucher?.voucher_config;
  const giftDescription =
    giftConfig?.gift_description || giftVoucher?.name || "Brinde";

  return (
    <Container>
      <Header>
        <Column span={10}>Produto</Column>
        <Column span={4}>Quantidade</Column>
        <Column span={4}>Valor Unitário</Column>
        <Column span={4}>Valor Total</Column>
        <Column span={2}>Ação</Column>
      </Header>

      {sale?.items?.length ||
      sale?.customerVoucher?.voucher?.products?.length ||
      sale?.customerVoucher?.additional_items_descriptions ? (
        <>
          <ItemContainer>
            <ItemContent>
              {sale?.customerVoucher?.voucher?.products?.length ? (
                <>
                  {sale?.customerVoucher.voucher.products.map((product) => (
                    <Item
                      key={product.id || product.product_name}
                      productVoucher={product}
                    />
                  ))}
                </>
              ) : (
                <></>
              )}
              {sale?.customerVoucher?.additional_items_descriptions?.length ? (
                <>
                  {sale?.customerVoucher?.additional_items_descriptions.map(
                    (additional_item_description) => (
                      <Item
                        key={additional_item_description}
                        additional_item_description={
                          additional_item_description
                        }
                      />
                    ),
                  )}
                </>
              ) : null}
              {sale?.items?.map((item) => (
                <Item key={item.id} item={item} />
              ))}
              {sale?.customerVoucher && sale?.discount > 0 && (
                <CouponRow>
                  <CouponLeft>
                    <CouponTag>Cupom</CouponTag>
                    <CouponName>
                      {sale.customerVoucher.voucher?.name ||
                        "Desconto aplicado"}
                    </CouponName>
                  </CouponLeft>
                  <CouponValue>
                    − R$ {sale.discount.toFixed(2).replace(".", ",")}
                  </CouponValue>
                </CouponRow>
              )}
              {giftVoucher && (
                <CouponRow>
                  <CouponLeft>
                    <CouponTag>
                      <GiftOutlined /> Brinde
                    </CouponTag>
                    <CouponName>Brinde liberado: {giftDescription}</CouponName>
                  </CouponLeft>
                </CouponRow>
              )}
            </ItemContent>
          </ItemContainer>
        </>
      ) : (
        <EmptyContainer>
          <Empty
            description="Nenhum item adicionado no carrinho"
            image={EmptyImg}
            imageStyle={{
              height: 300,
            }}
          />
        </EmptyContainer>
      )}
    </Container>
  );
};

export default Items;
