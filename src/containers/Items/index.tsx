import React from "react";

import { useSale } from "../../hooks/useSale";

import EmptyImg from "../../assets/svg/addCart.svg";
import { Empty } from "antd";

import Item from "../../components/Item";

import {
  Container,
  Header,
  Column,
  Description,
  ItemContainer,
  ItemContent,
  EmptyContainer,
} from "./styles";

const Items: React.FC = () => {
  const { sale } = useSale();
  return (
    <Container>
      {sale.items.length !== 0 ? (
        <>
          <Header>
            <Column span={10}>
              <Description>Produto</Description>
            </Column>
            <Column span={4}>
              <Description>Quantidade</Description>
            </Column>
            <Column span={4}>
              <Description>Valor Unitário</Description>
            </Column>
            <Column span={4}>
              <Description>Valor Total</Description>
            </Column>
            <Column span={2}>
              <Description>Ação</Description>
            </Column>
          </Header>

          <ItemContainer>
            <ItemContent>
              {sale.items.map((item) => (
                <Item key={item.id} item={item} />
              ))}
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
