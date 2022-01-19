import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import amountCash from "../../models/amountCash.json";

import { Input } from "antd";

import { Container, Row, Col, ButtonRegister } from "./styles";

interface IProp {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const AmountModal: React.FC<IProp> = ({ visible, setVisible }) => {
  return (
    <Container
      visible={visible}
      centered
      width={800}
      onCancel={() => setVisible(false)}
      footer={<span>Valor Total de Abertura: R$ 0,00</span>}
    >
      <Row>
        {amountCash.map((_amount) => (
          <Col sm={12}>
            <span>R$ {_amount.label}</span>{" "}
            <Input placeholder={_amount.label} />
          </Col>
        ))}
      </Row>

      <Row>
        <ButtonRegister>ABRIR CAIXA</ButtonRegister>
      </Row>
    </Container>
  );
};

export default AmountModal;
