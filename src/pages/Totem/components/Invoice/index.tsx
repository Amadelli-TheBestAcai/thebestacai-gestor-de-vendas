import React, { Dispatch, SetStateAction } from "react";

import { Container, Option } from "./styles";

interface IProps {
  setStep: Dispatch<SetStateAction<number>>;
}
const Invoice: React.FC<IProps> = ({ setStep }) => {
  return (
    <Container>
      <span>Como gostaria de receber a Nota Fiscal?</span>
      <div className="option-list">
        <Option>Imprimir</Option>
        <Option>Email</Option>
        <Option onClick={() => setStep(7)}>Não quero</Option>
      </div>
    </Container>
  );
};

export default Invoice;
