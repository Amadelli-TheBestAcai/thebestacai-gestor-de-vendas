import React, { useState } from "react";
import { currencyFormater } from "../../helpers/currencyFormater";
import { SaleDto } from "../../models/dtos/sale";

import moment from "moment";

import { Tooltip } from "antd";

import {
  Container,
  CardOrder,
  HeaderCard,
  Content,
  Checkbox,
  ActionContainer,
  CancelIcon,
} from "./styles";

interface IProps {
  deliveries: SaleDto[];
  finishSale: (id: string) => Promise<void>;
}
const OrderProgressList: React.FC<IProps> = ({ deliveries, finishSale }) => {
  const [check, setCheck] = useState(true);

  const handleFinish = (id: string) => {
    setCheck(!check);

    if (check) {
      finishSale(id);
    }
  };
  return (
    <Container>
      {deliveries?.map((_delivery) => (
        <CardOrder key={_delivery.id}>
          <HeaderCard>
            <span>
              {moment(_delivery.created_at, "yyyy-MM-DDTHH:mm:ss").format(
                "hh:mm:ss"
              )}
            </span>

            <ActionContainer>
              {" "}
              <Tooltip
                title="Confirmar venda"
                key={_delivery.id}
                placement="bottom"
              >
                <Checkbox onClick={() => handleFinish(_delivery.id)} />
              </Tooltip>
              <CancelIcon />
            </ActionContainer>
          </HeaderCard>
          <Content>
            <label> {_delivery.name}</label>
            <span>
              R${" "}
              {currencyFormater(
                _delivery.payments.reduce(
                  (total, _payment) => +_payment.amount + total,
                  0
                )
              )}
            </span>
          </Content>
        </CardOrder>
      ))}
    </Container>
  );
};

export default OrderProgressList;
