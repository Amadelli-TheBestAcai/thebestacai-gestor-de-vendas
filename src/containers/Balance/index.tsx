import React, { useState, useEffect } from "react";

import Spinner from "../../components/Spinner";

import { ProductDto } from "../../models/dtos/product";

import {
  Container,
  RightSide,
  LefttSide,
  InputPrice,
  InfoWeight,
} from "./styles";

const BalanceContainer: React.FC = () => {
  const [selfService, setselfService] = useState<ProductDto | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    async function init() {
      setLoading(true);
      const selfService = await window.Main.product.getSelfService();
      setselfService(selfService);
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
          <RightSide>
            <span>Preço indicado na balança</span>
            <InputPrice
              autoFocus={true}
              id="balanceInput"
              getValue={(value: number) => console.log(value)}
            />
          </RightSide>
          <LefttSide>
            <span>Peso</span>
            <InfoWeight>
              KG {(+selfService.price_unit)?.toFixed(4).replace(".", ",")}
            </InfoWeight>
            <span>Preço do KG</span>
            <InfoWeight>
              R$ {(+selfService?.price_unit)?.toFixed(2).replace(".", ",")}
            </InfoWeight>
          </LefttSide>
        </Container>
      )}
    </>
  );
};

export default BalanceContainer;
