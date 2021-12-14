import React from "react";

import { PaymentDto } from "../../models/dtos/payment";
import { PaymentType } from "../../models/enums/paymentType";

import { Container, Column, Description, Button, RemoveIcon } from "./styles";

type IProps = {
  payment: PaymentDto;
  removePayment: (id: string) => Promise<void>;
};

const Payment: React.FC<IProps> = ({ payment, removePayment }) => {
  return (
    <Container>
      <Column span={10}>
        <Description>{PaymentType[payment.type]}</Description>
      </Column>
      <Column span={10}>
        <Description>
          R$ {payment.amount?.toFixed(2).replace(".", ",")}
        </Description>
      </Column>
      <Column span={4}>
        <Button onClick={() => removePayment(payment.id)}>
          <RemoveIcon />
        </Button>
      </Column>
    </Container>
  );
};

export default Payment;
