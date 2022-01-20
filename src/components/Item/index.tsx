import React, { useState } from "react";

import { ItemDto } from "../../models/dtos/item";

import { useSale } from "../../hooks/useSale";

import { Tooltip, message } from "antd";

import { Container, Column, DeleteIcon, Button, Modal, Input } from "./styles";

type IProps = {
  item: ItemDto;
};

const Item: React.FC<IProps> = ({ item }) => {
  const { onDecressItem } = useSale();
  const [modalState, setModalState] = useState(false);
  const [reasson, setReasson] = useState<string>("");

  const onDelete = () => {
    Modal.confirm({
      title: "Deseja remover este item?",
      okText: "Remover",
      okType: "default",
      cancelText: "Cancelar",
      content: (
        <Input
          placeholder="Digite o motivo"
          onChange={({ target: { value } }) => setReasson(value)}
        />
      ),
      async onOk() {
        console.log({ reasson: reasson.length });
        if (reasson.length < 3) {
          message.warning("Digite um motivo válido");
          return;
        }
        await window.Main.itemOutCart.create(reasson, item.product.id);
        await onDecressItem(item.id);
      },
    });
  };

  return (
    <Container>
      <Column span={10}>{item.product.name}</Column>
      <Column span={4}>{item.quantity}</Column>
      <Column span={4}>
        R$ {(+item.storeProduct.price_unit).toFixed(2).replace(".", ",")}
      </Column>
      <Column span={4}>R$ {item.total.toFixed(2).replace(".", ",")}</Column>
      <Column span={2}>
        <Tooltip title="Remover" placement="bottom">
          <Button onClick={onDelete}>
            <DeleteIcon />
          </Button>
        </Tooltip>
      </Column>
    </Container>
  );
};

export default Item;
