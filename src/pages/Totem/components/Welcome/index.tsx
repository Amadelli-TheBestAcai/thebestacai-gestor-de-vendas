import React, { Dispatch, SetStateAction } from "react";

import { Container, Footer, Button } from "./styles";

interface IProps {
  setStep: Dispatch<SetStateAction<number>>;
  is_loading: boolean;
}

const Welcome: React.FC<IProps> = ({ setStep, is_loading }) => {
  return (
    <Container>
      <Footer>
        <Button onClick={() => setStep(2)} loading={is_loading}>
          Iniciar Pedido
        </Button>
      </Footer>
    </Container>
  );
};

export default Welcome;
