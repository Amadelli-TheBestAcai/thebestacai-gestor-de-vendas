import React, { Dispatch, SetStateAction, useState } from "react";

import { SaleDto } from "../../../../models/dtos/sale";

import printer from "../../../../assets/totem/svg/printer.svg";
import mail from "../../../../assets/totem/svg/mail.svg";
import cancel_circle from "../../../../assets/totem/svg/cancel_circle.svg";

import {
  Body,
  Button,
  ButtonFinalize,
  Container,
  Footer,
  Header,
  Icon,
  Input,
  Option,
} from "./styles";
import VirtualPinpad from "../VirtualPinpad";

interface IProps {
  setStep: Dispatch<SetStateAction<number>>;
  sale: SaleDto | null;
}
const Invoice: React.FC<IProps> = ({ setStep, sale }) => {
  const [email, setEmail] = useState<string>("");
  const [stepInvoice, setStepInvoice] = useState<number>(1);
  return (
    <Container>
      {stepInvoice === 1 ? (
        <>
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
              <Option onClick={() => setStepInvoice(2)}>
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
        </>
      ) : (
        <>
          <Header>
            <span>Nota Fiscal no E-mail</span>
          </Header>
          <Body style={{ padding: "6rem 0 0" }}>
            <span className="span-email">INFORME SEU E-MAIL</span>
            <div className="inputContainer">
              <Input value={email} placeholder={"email@email.com"} disabled />
            </div>
            <div className="div-pinpad">
              <VirtualPinpad email={email} setEmail={setEmail} />
            </div>
          </Body>
          <Footer>
            <Button onClick={() => setStepInvoice(1)}>Ver Outra Opção</Button>
            <ButtonFinalize onClick={() => setStepInvoice(1)}>
              Confirmar
            </ButtonFinalize>
          </Footer>
          <div className="div-footer-info">
            <span>
              Ao confirmar a inserção do seu e-mail, você concorda em fornecê-lo
              unicamente para receber a Nota Fiscal Eletrônica.
            </span>
          </div>
        </>
      )}
    </Container>
  );
};

export default Invoice;
