import React from "react";
import { currencyFormater } from "../../helpers/currencyFormater";
import { SaleDto } from "../../models/dtos/sale";

import { Checkbox, Tooltip } from "antd";

import { Container, CardOrder, HeaderCard, Content } from "./styles";

interface IProps {
  deliveries: SaleDto[];
  finishSale: (id: string) => Promise<void>;
}
const OrderProgressList: React.FC<IProps> = ({ deliveries, finishSale }) => {
  return (
    <Container>
      {deliveries?.map((_delivery) => (
        <CardOrder onClick={() => finishSale(_delivery.id)} key={_delivery.id}>
          <HeaderCard>
            <span>{_delivery.created_at.split(" ")[1]}</span>
            <Tooltip
              title="Confirmar venda"
              key={_delivery.id}
              placement="bottom"
            >
              <Checkbox />
            </Tooltip>
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
