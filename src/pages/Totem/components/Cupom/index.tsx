import React, { Dispatch, SetStateAction, useState } from "react";

import arrow_left from "../../../../assets/totem/svg/arrow_left.svg";

import { useSale } from "../../../../hooks/useSale";

import VirtualPinpad from "../VirtualPinpad";

import {
  Body,
  Button,
  ButtonFinalize,
  Container,
  Footer,
  Header,
  Input,
} from "./styles";

interface IProps {
  setStep: Dispatch<SetStateAction<number>>;
}
const Cupom: React.FC<IProps> = ({ setStep }) => {
  const { sale, setSale } = useSale();
  const [cupom, setCupom] = useState<string>("");
  const [stepCupomPage, setSetpCupomPage] = useState<1 | 2>(1);

  const onAddCupom = async () => {
    setSetpCupomPage(2);
  };

  return (
    <Container>
      {stepCupomPage === 1 ? (
        <>
          <Header>
            <span>Inserir Cupom</span>
          </Header>
          <Body style={{ padding: "6rem 0 0" }}>
            <span className="span-cupom">INFORME O CÓDIGO DO CUPOM</span>
            <div className="inputContainer">
              <Input value={cupom} placeholder={"Código do cupom"} disabled />
            </div>
            <div className="div-pinpad">
              <VirtualPinpad value={cupom} setValue={setCupom} maxLenght={6} />
            </div>
          </Body>
          <Footer>
            <Button onClick={() => setStep(4)}>
              <img src={arrow_left} />
              Voltar
            </Button>
            <ButtonFinalize
              onClick={() => {
                onAddCupom();
              }}
              step={stepCupomPage}
            >
              Confirmar
            </ButtonFinalize>
          </Footer>
        </>
      ) : (
        <>
          <Header>
            <span>Cupom inserido com sucesso!</span>
          </Header>
          <Footer>
            <ButtonFinalize
              onClick={() => {
                onAddCupom();
              }}
              step={stepCupomPage}
            >
              Confirmar
            </ButtonFinalize>
          </Footer>
        </>
      )}
    </Container>
  );
};

export default Cupom;
