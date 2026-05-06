import React from "react";

import { useSale } from "../../hooks/useSale";

import EmptyImg from "../../assets/svg/addCart.svg";
import { Empty } from "antd";

import Item from "../../components/Item";

import {
  Container,
  Header,
  Column,
  ItemContainer,
  ItemContent,
  EmptyContainer,
} from "./styles";

const Items: React.FC = () => {
  const { sale } = useSale();
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
                    <Item key={product.id||product.product_name} productVoucher={product} />
                  ))}
                </>
              ) : <></>}
              {sale?.customerVoucher?.additional_items_descriptions?.length ? (
                <>
                  {sale?.customerVoucher?.additional_items_descriptions.map((additional_item_description) => (
                    <Item key={additional_item_description} additional_item_description={additional_item_description} />
                  ))}
                </>
              ) : null}
              {sale?.items?.map((item) => (
                <Item key={item.id} item={item} />
              ))}
              {(() => {
                if (!sale?.customerVoucher) return null;
                if (sale?.customerVoucher?.voucher?.products?.length) return null;
                if (!sale?.items?.length) return null;
                const sumItems = sale.items.reduce(
                  (total, item) => total + item.total,
                  0
                );
                const discountAmount = sumItems - sale.total_sold;
                if (discountAmount <= 0) return null;
                return (
                  <Item
                    key="cupom-general-discount"
                    productVoucher={{
                      product_name: `Desconto - ${
                        sale.customerVoucher.voucher?.name || "Cupom"
                      }`,
                      price_sell: discountAmount.toFixed(2),
                      is_registred: true,
                      in_sale: true,
                    }}
                  />
                );
              })()}
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
