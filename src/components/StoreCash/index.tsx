import React from "react";

import {
  Container,
  CardCashContainer,
  ButtonStatusContainer,
  CardCash,
  CashIcon,
  Icon,
  InfoCash,
  StatusButton,
} from "./styles";

type IProps = {
  cash: { store_cash: string; available: boolean };
  handleCash: (cash: string) => void;
};

const StoreCash: React.FC<IProps> = ({ cash, handleCash }) => {
  const { store_cash, available } = cash;

  return (
    <Container>
      <CardCashContainer>
        <CardCash
          onClick={() => handleCash(cash.store_cash)}
          disabled={!available}
        >
          <Icon>
            <CashIcon />
          </Icon>
          <InfoCash>
            <p>CAIXA</p>
            <span>{store_cash}</span>
          </InfoCash>
        </CardCash>
      </CardCashContainer>

      <ButtonStatusContainer>
        <StatusButton available={available}>
          {available && "HABILITADO"}
        </StatusButton>
      </ButtonStatusContainer>
    </Container>
  );
};

export default StoreCash;
