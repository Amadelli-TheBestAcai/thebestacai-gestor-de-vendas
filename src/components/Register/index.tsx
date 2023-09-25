import React from "react";

import { useSale } from "../../hooks/useSale";
import ClientInfo from "../../components/ClientInfo";

import { Spin } from "antd";
import { Container, ContentValue, ButtonFinisher } from "./styles";

const Register: React.FC = () => {
  const { sale, setShouldOpenClientInfo, isSavingSale } = useSale();
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
          <strong>
            R${" "}
            {monetaryFormat(
              sale?.total_sold -
                +(sale.customer_nps_reward_discount || 0) -
                sale?.discount
            )}
          </strong>
        </span>
      </ContentValue>
      <ButtonFinisher onClick={() => setShouldOpenClientInfo(true)}>
        {" "}
        {isSavingSale ? <Spin /> : "FINALIZAR [F1]"}
      </ButtonFinisher>
      <ClientInfo />
    </Container>
  );
};

export default Register;
