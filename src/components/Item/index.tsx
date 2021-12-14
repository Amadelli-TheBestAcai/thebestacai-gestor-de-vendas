import React from "react";

import { ItemDto } from "../../models/dtos/item";

import { message as messageAnt } from "antd";

import { Container, Column, Button, Description, RemoveIcon } from "./styles";

type IProps = {
  item: ItemDto;
  handleItem: (id: string) => void;
};

const Item: React.FC<IProps> = ({ item, handleItem }) => {
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
        <Button onClick={() => handleItem(item.id)}>
          <RemoveIcon />
        </Button>
      </Column>
    </Container>
  );
};

export default Item;
