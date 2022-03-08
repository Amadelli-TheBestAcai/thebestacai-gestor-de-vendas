import React, { useState } from "react";

import { ItemDto } from "../../models/dtos/item";

import { useSale } from "../../hooks/useSale";

import { Tooltip, notification } from "antd";

import {
  Container,
  Column,
  DeleteIcon,
  Button,
  Modal,
  Input,
  Footer,
  ButtonSave,
  ButtonCancel,
} from "./styles";

type IProps = {
  item: ItemDto;
};

const Item: React.FC<IProps> = ({ item }) => {
  const { onDecressItem } = useSale();
  const [modalState, setModalState] = useState(false);
  const [reasson, setReasson] = useState<string>("");

  const removeItem = async (): Promise<void> => {
    setModalState(true);
    if (reasson.length < 3) {
      notification.warning({
        message: "Oops! ",
        description:
          "Digite um motivo válido para a remoção do item de seu carrinho.",
        duration: 5,
      });
      return;
    }
    await window.Main.itemOutCart.create(reasson, item.product.id);
    await onDecressItem(item.id);
  };

  return (
    <Container>
      <Column span={10}>{item.product.name}</Column>
      <Column span={4}>{item.quantity}</Column>
      <Column span={4}>
        R$ {(+item.storeProduct.price_unit).toFixed(2).replace(".", ",")}
      </Column>
      <Column span={4}>R$ {item.total?.toFixed(2).replace(".", ",")}</Column>
      <Column span={2}>
        <Tooltip title="Remover" placement="bottom">
          <Button onClick={() => setModalState(true)}>
            <DeleteIcon />
          </Button>
        </Tooltip>
      </Column>

      <Modal
        title="Remover item"
        visible={modalState}
        onCancel={() => setModalState(false)}
        destroyOnClose={true}
        closable={true}
        centered
        afterClose={() => document.getElementById("mainContainer").focus()}
        footer={
          <Footer>
            <ButtonCancel onClick={() => setModalState(false)}>
              Cancelar
            </ButtonCancel>
            <ButtonSave onClick={removeItem}>Salvar Alteração</ButtonSave>
          </Footer>
        }
      >
        <Input
          autoFocus={true}
          placeholder="Digite o motivo"
          onChange={({ target: { value } }) => setReasson(value)}
        />
      </Modal>
    </Container>
  );
};

export default Item;
