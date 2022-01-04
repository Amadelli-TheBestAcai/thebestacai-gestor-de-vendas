import React from "react";

import { ItemDto } from "../../models/dtos/item";

import { useSale } from "../../hooks/useSale";

import { Container, Column, Button, Description, RemoveIcon } from "./styles";

type IProps = {
  item: ItemDto;
};

const Item: React.FC<IProps> = ({ item }) => {
  const { onDecressItem } = useSale();
  return (
    <Container>
      <Column span={10}>
        <Description>{item.product.name}</Description>
      </Column>
      <Column span={4}>
        <Description>{item.quantity}</Description>
      </Column>
      <Column span={4}>
        <Description>
          R$ {(+item.storeProduct.price_unit).toFixed(2).replace(".", ",")}
        </Description>
      </Column>
      <Column span={4}>
        <Description>R$ {item.total.toFixed(2).replace(".", ",")}</Description>
      </Column>
      <Column span={2}>
        <Button onClick={() => onDecressItem(item.id)}>
          <RemoveIcon />
        </Button>
      </Column>
    </Container>
  );
};

export default Item;
