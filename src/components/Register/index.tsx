import React from "react";

import { useSale } from "../../hooks/useSale";
import ClientInfo from "../ClientCPFInfo";

import { Spin } from "antd";
import { Container, ContentValue, ButtonFinisher } from "./styles";
import { monetaryFormat } from "../../helpers/monetaryFormat";

const Register: React.FC = () => {
  const { sale, isSavingSale, onRegisterSale } = useSale();

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
      <ButtonFinisher onClick={onRegisterSale}>
        {" "}
        {isSavingSale ? <Spin /> : "FINALIZAR [F1]"}
      </ButtonFinisher>
    </Container>
  );
};

export default Register;
