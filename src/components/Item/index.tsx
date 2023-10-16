import React, { useState } from "react";

import { ItemDto } from "../../models/dtos/item";
import { ProductVoucher } from "../../models/dtos/voucher";

import { useSale } from "../../hooks/useSale";

import { Col, Row, Tooltip, notification } from "antd";

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
  Radio,
  Form,
} from "./styles";

type IProps = {
  item?: ItemDto;
  productVoucher?: ProductVoucher;
};

const options = [
  "Erro de digitação",
  "Cliente deseja se servir novamente",
  "Forma de pagamento alterada",
  "Venda anterior não foi finalizada",
  "Outros",
];

const Item: React.FC<IProps> = ({ item, productVoucher }) => {
  const { onDecressItem, sale } = useSale();
  const [modalState, setModalState] = useState(false);
  const [disabled, setdisabled] = useState(false);
  const [reasonOption, setReasonOption] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [form] = Form.useForm();

  const removeItem = async (): Promise<void> => {
    await form.validateFields();
    if (item.product.id === 1 && sale?.customerVoucher?.voucher?.self_service) {
      notification.warning({
        message: "Não é possível remover self-service",
        description:
          "Para remover self-serivces é necessário remover o cupom que está aplicado.",
        duration: 5,
      });
      return;
    }
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

    if (reasonOption.length < 3) {
      errorMessage =
        "Digite um motivo válido para a remoção do item de seu carrinho.";
    }

    if (reasonOption.length > 150) {
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

    let price_sell = +item.storeProduct.price_unit;
    if (item.product.category.id === 1) {
      price_sell = +item.total;
    }

    await window.Main.itemOutCart.create(
      reasonOption,
      item.product.id,
      +price_sell
    );
    setModalState(false);
    setdisabled(false);
  };

  return (
    <>
      {item && (
        <Container>
          <Column span={10}>{item.product.name}</Column>
          <Column span={4}>{item.quantity}</Column>
          <Column span={4}>
            R$ {(+item.storeProduct.price_unit).toFixed(2).replace(".", ",")}
          </Column>
          <Column span={4}>
            R$ {item.total?.toFixed(2).replace(".", ",")}
          </Column>
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
            <Form layout="vertical" form={form}>
              <Row gutter={24}>
                <Col sm={24}>
                  <Form.Item
                    label="Selecione um motivo"
                    name="unity"
                    rules={[{ required: true, message: "Selecione um motivo" }]}
                  >
                    <Radio.Group
                      onChange={(e) => {
                        setReasonOption(e.target.value);
                        setShowOtherInput(e.target.value === "Outros");
                      }}
                      value={reasonOption}
                    >
                      {options.map((option, index) => (
                        <Radio key={index} value={option}>
                          {option}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                </Col>

                {showOtherInput && (
                  <Col sm={24}>
                    <Form.Item
                      rules={[{ required: true, message: "Campo obrigatório" }]}
                      label="Digite o motivo"
                      name="motivo"
                    >
                      <Input
                        required={true}
                        autoFocus={true}
                        maxLength={150}
                        value={reasonOption}
                        onChange={({ target: { value } }) =>
                          setReasonOption(value)
                        }
                      />
                    </Form.Item>
                  </Col>
                )}
              </Row>
            </Form>
          </Modal>
        </Container>
      )}
      {productVoucher && (
        <Container>
          <Column span={10}>[CUPOM] {productVoucher.product_name}</Column>
          <Column span={4}>1</Column>
          <Column span={4}></Column>
          <Column span={4}>R$ {productVoucher.price_sell}</Column>
          <Column span={2}></Column>
        </Container>
      )}
    </>
  );
};

export default Item;
