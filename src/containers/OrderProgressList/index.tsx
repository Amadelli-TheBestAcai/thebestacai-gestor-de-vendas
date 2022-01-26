import React from "react";

import { Container, CardOrder } from "./styles";

const OrderProgressList: React.FC = () => {
  return (
    <Container>
      <CardOrder>
        <span>15:30:02</span>
      </CardOrder>
      <CardOrder>
        <span>15:30:02</span>
      </CardOrder>
      <CardOrder>
        <span>15:30:02</span>
      </CardOrder>
      <CardOrder>
        <span>15:30:02</span>
      </CardOrder>
      <CardOrder>
        <span>15:30:02</span>
      </CardOrder>
      <CardOrder>
        <span>15:30:02</span>
      </CardOrder>
      <CardOrder>
        <span>15:30:02</span>
      </CardOrder>
    </Container>
  );
};

export default OrderProgressList;
