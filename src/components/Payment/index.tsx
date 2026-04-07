import React from "react";

import { PaymentDto } from "../../models/dtos/payment";
import { useSale } from "../../hooks/useSale";

import Spinner from "../Spinner";

import { Tooltip } from "antd";
import { FlagCard } from "../../models/enums/flagCard";
import { PaymentType } from "../../models/enums/paymentType";

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
  removePayment: (payment: PaymentDto, justify?: string) => Promise<void>;
  loadingPayment: boolean;
};

const Payment: React.FC<IProps> = ({
  payment,
  removePayment,
  loadingPayment,
}) => {
  const { isSavingSale } = useSale();

  return (
    <Container>
      {loadingPayment ? (
        <Spinner />
      ) : (
        <Content>
          <InfoPayment key={payment.id}>
            <Column sm={6}>{PaymentType[payment.type]}</Column>
            <Column sm={6}>
              {payment.flag_card
                ? FlagCard.find((flag) => flag.id === payment.flag_card)?.value
                : ""}
            </Column>
            <Column sm={6}>
              R$ {payment.amount?.toFixed(2).replace(".", ",")}
            </Column>
            <Column sm={6}>
              {!payment.code_nsu && (
                <Tooltip title="Remover" placement="bottom">
                  <Button
                    disabled={isSavingSale}
                    onClick={() => {
                      removePayment(payment);
                      document.getElementById("balanceInput")?.focus();
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </Tooltip>
              )}
            </Column>
          </InfoPayment>
        </Content>
      )}
    </Container>
  );
};

export default Payment;
