import React, { Dispatch, SetStateAction } from "react";
import { currencyFormater } from "../../helpers/currencyFormater";
import { SaleDto } from "../../models/dtos/sale";

import { Checkbox, Tooltip } from "antd";

import { Container, CardOrder, HeaderCard, Content } from "./styles";

interface IProps {
  deliveries: SaleDto[];
  finishSale: (id: string) => Promise<void>;
  isChecked: boolean;
  setIsChecked: Dispatch<SetStateAction<boolean>>;
}
const OrderProgressList: React.FC<IProps> = ({
  deliveries,
  finishSale,
  isChecked,
  setIsChecked,
}) => {
  const FinisheSaleCheck = () => {};

  return (
    <Container>
      {deliveries.map((_delivery) => (
        <CardOrder onClick={() => finishSale(_delivery.id)} key={_delivery.id}>
          <HeaderCard>
            <span>{_delivery.created_at.split(" ")[1]}</span>
            <Tooltip
              title="Confirmar venda"
              key={_delivery.id}
              placement="bottom"
            >
              <Checkbox onClick={() => FinisheSaleCheck()} />
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
