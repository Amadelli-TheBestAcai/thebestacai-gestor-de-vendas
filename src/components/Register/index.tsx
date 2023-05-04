import React from "react";

import { useSale } from "../../hooks/useSale";

import { Spin } from "antd";
import { Container, ContentValue, ButtonFinisher } from "./styles";

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
      <ContentValue>
        <span>
          VALOR TOTAL <br />{" "}
          <strong>R$ {monetaryFormat(sale?.total_sold - +sale?.discount)}</strong>
        </span>
      </ContentValue>
      <ButtonFinisher onClick={() => onRegisterSale()}>
        {" "}
        {isSavingSale ? <Spin /> : "FINALIZAR [F1]"}
      </ButtonFinisher>
    </Container>
  );
};

export default Register;
