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
  const { onDecressItem, sale } = useSale();
  const [modalState, setModalState] = useState(false);
  const [disabled, setdisabled] = useState(false);
  const [reasson, setReasson] = useState<string>("");

  const removeItem = async (): Promise<void> => {
    if (sale.discount > 0) {
      notification.warning({
        message: "Falha ao remover produto",
        description:
          "Para remover um produto é necessário remover o desconto aplicado",
        duration: 5,
      });
      return;
    }
    setModalState(true);
    let errorMessage = "";

    if (reasson.length < 3) {
      errorMessage =
        "Digite um motivo válido para a remoção do item de seu carrinho.";
    }

    if (reasson.length > 100) {
      errorMessage = "O motivo não deve ultrapassar 100 caracteres.";
    }

    if (errorMessage) {
      notification.warning({
        message: "Oops!",
        description: errorMessage,
        duration: 5,
      });
      return;
    }

    setdisabled(true);
    await onDecressItem(item.id);
    await window.Main.itemOutCart.create(reasson, item.product.id, +item.storeProduct.price_unit);
    setModalState(false);
    setdisabled(false);
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
            <ButtonSave onClick={removeItem} disabled={disabled}>
              Salvar Alteração
            </ButtonSave>
          </Footer>
        }
      >
        <Input
          onPressEnter={removeItem}
          autoFocus={true}
          placeholder="Digite o motivo"
          onChange={({ target: { value } }) => setReasson(value)}
        />
      </Modal>
    </Container>
  );
};

export default Item;
