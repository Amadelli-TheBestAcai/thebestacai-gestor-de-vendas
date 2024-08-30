import React, { Dispatch, SetStateAction } from "react";

import { SaleDto } from "../../../../models/dtos/sale";

import printer from "../../../../assets/totem/svg/printer.svg";
import mail from "../../../../assets/totem/svg/mail.svg";
import cancel_circle from "../../../../assets/totem/svg/cancel_circle.svg";

import { Body, Container, Header, Icon, Option } from "./styles";

interface IProps {
  setStep: Dispatch<SetStateAction<number>>;
  sale: SaleDto | null;
}
const Invoice: React.FC<IProps> = ({ setStep, sale }) => {
  return (
    <Container>
      <Header>
        <span>Como gostaria de receber a Nota Fiscal?</span>
      </Header>
      <Body>
        <div className="option-list">
          <Option>
            {" "}
            <Icon src={printer} />
            <span>Imprimir</span>
          </Option>
          <Option>
            {" "}
            <Icon src={mail} />
            <span>Email</span>
          </Option>
        </div>
        <div className="option-center">
          <Option
            onClick={() => setStep(7)}
            style={{
              background: "var(--white)",
              border: "4px solid var(--black)",
            }}
          >
            {" "}
            <Icon src={cancel_circle} />
            <span>Não quero</span>
          </Option>
        </div>
      </Body>
    </Container>
  );
};

export default Invoice;
