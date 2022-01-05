import React from "react";

import { ItemDto } from "../../models/dtos/item";

import { useSale } from "../../hooks/useSale";

import { Container, Column, DeleteIcon, Button } from "./styles";

type IProps = {
  item: ItemDto;
};

const Item: React.FC<IProps> = ({ item }) => {
  const { onDecressItem } = useSale();
  return (
    <Container>
      <Column span={10}>{item.product.name}</Column>
      <Column span={4}>{item.quantity}</Column>
      <Column span={4}>
        R$ {(+item.storeProduct.price_unit).toFixed(2).replace(".", ",")}
      </Column>
      <Column span={4}>R$ {item.total.toFixed(2).replace(".", ",")}</Column>
      <Column span={2}>
        <Button onClick={() => onDecressItem(item.id)}>
          <DeleteIcon />
        </Button>
      </Column>
    </Container>
  );
};

export default Item;
