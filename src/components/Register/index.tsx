import React from "react";

import { Spin } from "antd";

import { Container, ContentValue, ButtonFinisher } from "./styles";

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
      <ContentValue>
        <span>
          VALOR TOTAL <br /> <strong>R$ {monetaryFormat(total)}</strong>
        </span>
      </ContentValue>
      <ButtonFinisher onClick={() => registerSale()}>
        {" "}
        {isSavingSale ? <Spin /> : "FINALIZAR [F1]"}
      </ButtonFinisher>
    </Container>
  );
};

export default Register;
