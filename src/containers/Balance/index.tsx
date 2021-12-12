import React, { useState, useEffect } from "react";

import Spinner from "../../components/Spinner";

import { ProductDto } from "../../models/dtos/product";

import {
  Container,
  TopContainer,
  BottomContainer,
  Price,
  Weight,
  PriceContainer,
  Text,
  WeightContainer,
  InputPrice,
} from "./styles";

const BalanceContainer: React.FC = () => {
  const [selfService, setselfService] = useState<ProductDto | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    async function init() {
      setLoading(true);
      const products = await window.Main.product.getSelfService();
      setselfService(products);
      setLoading(false);
    }
    init();
  }, []);
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Container>
          <TopContainer>
            <Text>Preço indicado na balança</Text>

            <InputPrice
              autoFocus={true}
              id="balanceInput"
              getValue={(value: number) => console.log(value)}
            />
          </TopContainer>
          <BottomContainer>
            <PriceContainer>
              <Text>Preço do KG</Text>
              <Price>
                R$ {(+selfService?.price_unit)?.toFixed(2).replace(".", ",")}
              </Price>
            </PriceContainer>
            <WeightContainer>
              <Text>Peso</Text>
              <Weight>
                KG {(+selfService.price_unit)?.toFixed(4).replace(".", ",")}
              </Weight>
            </WeightContainer>
          </BottomContainer>
        </Container>
      )}
    </>
  );
};

export default BalanceContainer;
