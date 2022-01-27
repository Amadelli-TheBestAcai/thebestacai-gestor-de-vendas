import React from "react";

import { PaymentDto } from "../../models/dtos/payment";
import { PaymentType } from "../../models/enums/paymentType";

import { Tooltip } from "antd";

import {
  Container,
  Content,
  InfoPayment,
  Column,
  Button,
  DeleteIcon,
} from "./styles";

type IProps = {
  payment: PaymentDto;
  removePayment: (id: string) => Promise<void>;
};

const Payment: React.FC<IProps> = ({ payment, removePayment }) => {
  return (
    <Container>
      <Content>
        <InfoPayment key={payment.id}>
          <Column sm={8}>{PaymentType[payment.type]}</Column>
          <Column sm={8}>
            R$ {payment.amount?.toFixed(2).replace(".", ",")}
          </Column>
          <Column sm={8}>
            <Tooltip title="Remover" placement="bottom">
              <Button onClick={() => removePayment(payment.id)}>
                <DeleteIcon />
              </Button>
            </Tooltip>
          </Column>
        </InfoPayment>
      </Content>
    </Container>
  );
};

export default Payment;
