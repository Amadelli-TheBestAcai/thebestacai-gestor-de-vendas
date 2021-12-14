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

interface IProps {
  isSavingSale: boolean;
  total: number;
  registerSale: () => void;
}

const Register: React.FC<IProps> = ({ total, registerSale, isSavingSale }) => {
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
            R$ {monetaryFormat(total)}
          </AmountValue>
        </AmountContainer>
      </Content>
      <Footer onClick={() => registerSale()}>
        {isSavingSale ? <Spin /> : "[F1] REGISTRAR"}
      </Footer>
    </Container>
  );
};

export default Register;
