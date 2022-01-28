import React from "react";

import { Container, CardOrder, HeaderCard, CheckboxIcon } from "./styles";

const OrderProgressList: React.FC = () => {
  return (
    <Container>
      <CardOrder>
        <HeaderCard>
          <span>15:30:02</span>
          <CheckboxIcon />
        </HeaderCard>
      </CardOrder>
    </Container>
  );
};

export default OrderProgressList;
