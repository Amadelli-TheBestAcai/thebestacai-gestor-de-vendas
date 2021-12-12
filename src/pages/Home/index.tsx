import React, { useEffect, useState } from "react";

import Products from "../../containers/Products";
import Balance from "../../containers/Balance";

import { ProductDto } from "../../models/dtos/product";

import {
  Container,
  Content,
  RightSide,
  LeftSide,
  BalanceContainer,
  ProductsContainer,
  ItemsContainer,
  PaymentsContainer,
  PaymentsTypesContainer,
  FinishContainer,
  ActionsContainer,
} from "./styles";

const Home: React.FC = () => {
  return (
    <Container id="mainContainer" allowChanges={true}>
      <LeftSide>
        <BalanceContainer>
          <Balance />
        </BalanceContainer>
        <ProductsContainer>
          <Products />
        </ProductsContainer>
      </LeftSide>
      <RightSide>
        <Content>
          <ActionsContainer></ActionsContainer>
          <ItemsContainer></ItemsContainer>
          <PaymentsContainer>
            <PaymentsTypesContainer></PaymentsTypesContainer>
            <FinishContainer></FinishContainer>
          </PaymentsContainer>
        </Content>
      </RightSide>
    </Container>
  );
};

export default Home;
