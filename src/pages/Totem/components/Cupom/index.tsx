import React, { Dispatch, SetStateAction, useState } from "react";

import cupom from "../../../../assets/totem/svg/cupom.svg";
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
  const [cupomInput, setCupomInput] = useState<string>("");
  const [validCupom, setValidCupom] = useState<string>("Teste");
  const [stepCupomPage, setStepCupomPage] = useState<1 | 2>(1);

  const onAddCupom = async () => {
    setStepCupomPage(2);
  };

  const returnCheckOut = async () => {
    setStepCupomPage(1);
    setCupomInput("");
    setValidCupom("");
    setStep(4);
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
              <Input
                value={cupomInput}
                placeholder={"Código do cupom"}
                disabled
              />
            </div>
            <div className="div-pinpad">
              <VirtualPinpad
                value={cupomInput}
                setValue={setCupomInput}
                maxLenght={8}
              />
            </div>
          </Body>
          <Footer>
            <Button onClick={() => returnCheckOut()}>
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
          <Body style={{ padding: "6rem 0 0" }}>
            <span className="span-cupom-title">
              <img src={cupom} />
              {validCupom || ""}
            </span>
            <img src={cupom} className="cupom-img" />
            <div className="cupom-description">
              Válido apenas na Black Friday, 29/11.
              <br /> Promoção válida em todas as lojas da The Best Açaí. Cupons
              ilimitados, resgate quantos quiser.
              <br />
              Cupons são específicos de cada loja.
              <br /> Para cada pagamento no caixa, é necessário gerar um novo
              cupom. <br />
              Não é válido para potes que contenham apenas acompanhamentos,
              Promoção não cumulativa com outras promoções.
              <br /> A utilização desse cupom inviabiliza o acúmulo de pontos no
              Clube The Best.
            </div>
          </Body>
          <Footer>
            <ButtonFinalize
              onClick={() => {
                returnCheckOut();
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
