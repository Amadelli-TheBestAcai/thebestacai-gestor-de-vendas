import React from "react";

import SpinSVG from "../../assets/svg/spin.svg";

import { Container, Spin } from "./styles";

const Spinner: React.FC = () => {
  return (
    <Container>
      <Spin src={SpinSVG} />
    </Container>
  );
};

export default Spinner;
