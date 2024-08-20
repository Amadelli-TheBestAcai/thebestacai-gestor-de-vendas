import React, { Dispatch, SetStateAction } from "react";

import { Container, Option } from "./styles";
import { SaleDto } from "../../../../models/dtos/sale";

interface IProps {
  setStep: Dispatch<SetStateAction<number>>;
  sale: SaleDto | null;
}
const Invoice: React.FC<IProps> = ({ setStep, sale }) => {
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
