import React from "react";

import { Spin } from "antd";

import {
  Container,
  Content,
  Footer,
  AmountContainer,
  Description,
  AmountValue,
} from "./styles";

import { useSale } from "../../hooks/useSale";
const Register: React.FC = () => {
  const { sale, onRegisterSale, isSavingSale } = useSale();
  const monetaryFormat = (value: number): string => {
    if (!value) {
      return "0,00";
    }
    return value.toFixed(2).replace(".", ",");
  };
  return (
    <Container>
      <Content>
        <AmountContainer style={{ width: "100%" }}>
          <Description>Total</Description>
          <AmountValue style={{ fontSize: "35px" }}>
            R$ {monetaryFormat(sale.total_sold)}
          </AmountValue>
        </AmountContainer>
      </Content>
      <Footer onClick={() => onRegisterSale()}>
        {isSavingSale ? <Spin /> : "[F1] REGISTRAR"}
      </Footer>
    </Container>
  );
};

export default Register;
