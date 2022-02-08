import React from "react";

import CashNotImg from "../../assets/svg/Investing.svg";

import { Empty } from "antd";

import { Container } from "./styles";

const CashNotFound: React.FC = () => {
  return (
    <Container>
      <Empty
        description="Nenhum caixa aberto no momento. Abra o caixa para iniciar as vendas."
        image={CashNotImg}
        imageStyle={{
          height: 350,
        }}
      />
    </Container>
  );
};

export default CashNotFound;
