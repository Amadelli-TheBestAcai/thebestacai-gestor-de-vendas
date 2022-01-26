import React, { useState } from "react";

import AmountModal from "../../components/AmountModal";

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
  handleClick: any;
};

const StoreCash: React.FC<IProps> = ({ cash, handleClick }) => {
  const { store_cash, available } = cash;
  const [visible, setVisible] = useState<boolean>(false);
  return (
    <Container>
      <CardCashContainer>
        <CardCash onClick={() => setVisible(true)} disabled={!available}>
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

      <AmountModal visible={visible} setVisible={setVisible} />
    </Container>
  );
};

export default StoreCash;
