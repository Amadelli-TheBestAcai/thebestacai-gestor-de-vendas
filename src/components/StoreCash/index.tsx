import React from "react";

import {
  Container,
  Description,
  CashIcon,
  IconContainer,
  Status,
} from "./styles";

type IProps = {
  cash: { store_cash: string; available: boolean };
  handleClick: any;
};

const StoreCash: React.FC<IProps> = ({ cash, handleClick }) => {
  const { store_cash, available } = cash;
  return (
    <Container>
      <Description>Caixa {store_cash}</Description>
      <IconContainer
        onClick={() => handleClick(cash)}
        style={{ background: available ? "#FFB13D" : "#989898" }}
      >
        <CashIcon />
      </IconContainer>
      <Status style={{ color: available ? "#3CD223" : "#FF2E2E" }}>
        {available ? "HABILITADO" : "DESABILITADO"}
      </Status>
    </Container>
  );
};

export default StoreCash;
