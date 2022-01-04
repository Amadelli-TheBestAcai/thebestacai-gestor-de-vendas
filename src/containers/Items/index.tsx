import React from "react";

import { useSale } from "../../hooks/useSale";

import Item from "../../components/Item";

import {
  Container,
  Header,
  Column,
  Description,
  ItemContainer,
  ItemContent,
} from "./styles";

const Items: React.FC = () => {
  const { sale } = useSale();
  return (
    <Container>
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
    </Container>
  );
};

export default Items;
