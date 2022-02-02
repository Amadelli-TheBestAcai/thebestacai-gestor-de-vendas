import React from "react";

import { Container, CardOrder, HeaderCard, CheckboxIcon } from "./styles";

import { SaleDto } from "../../models/dtos/sale";
interface IProps {
  deliveries: SaleDto[];
  finishSale: (id: string) => Promise<void>;
}
const OrderProgressList: React.FC<IProps> = ({ deliveries, finishSale }) => {
  return (
    <Container>
      {deliveries.map((_delivery) => (
        <CardOrder onClick={() => finishSale(_delivery.id)} key={_delivery.id}>
          <HeaderCard>
            <span>{_delivery.created_at.split(" ")[1]}</span>
            <CheckboxIcon />
          </HeaderCard>
          {_delivery.name}
        </CardOrder>
      ))}
    </Container>
  );
};

export default OrderProgressList;
