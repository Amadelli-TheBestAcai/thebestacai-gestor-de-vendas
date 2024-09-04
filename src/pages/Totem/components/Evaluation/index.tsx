import React, { useState, Dispatch, SetStateAction } from "react";

import { SaleDto } from "../../../../models/dtos/sale";
import { SalesTypes } from "../../../../models/enums/salesTypes";

import totem_very_bad from "../../../../assets/totem/svg/totem_very_bad.svg";
import totem_bad from "../../../../assets/totem/svg/totem_bad.svg";
import totem_normal from "../../../../assets/totem/svg/totem_normal.svg";
import totem_good from "../../../../assets/totem/svg/totem_good.svg";
import totem_very_good from "../../../../assets/totem/svg/totem_very_good.svg";
import finish_image from "../../../../assets/totem/svg/finish_image.svg";

import { notification } from "antd";

import {
  Container,
  Button,
  Modal,
  NpsContainer,
  EvalutionContainer,
  ButtonNewOrder,
  Header,
  Body,
  Footer,
} from "./styles";

interface IProps {
  setStep: Dispatch<SetStateAction<number>>;
  sale: SaleDto | null;
  setSale: Dispatch<SetStateAction<SaleDto | null>>;
}
const Evaluation: React.FC<IProps> = ({ setStep, sale, setSale }) => {
  const [loading, setLoading] = useState(false);
  const [openNps, setOpenNps] = useState(true);

  const npsScores = [
    {
      id: 1,
      element: (
        <EvalutionContainer>
          <img src={totem_very_bad} />
          <span>Péssima</span>
        </EvalutionContainer>
      ),
      value: 1,
    },
    {
      id: 2,
      element: (
        <EvalutionContainer>
          <img src={totem_bad} />
          <span>Ruim</span>
        </EvalutionContainer>
      ),
      value: 2,
    },
    {
      id: 3,
      element: (
        <EvalutionContainer>
          <img src={totem_normal} />
          <span>Regular</span>
        </EvalutionContainer>
      ),
      value: 3,
    },
    {
      id: 4,
      element: (
        <EvalutionContainer>
          <img src={totem_good} />
          <span>Boa</span>
        </EvalutionContainer>
      ),
      value: 4,
    },
    {
      id: 5,
      element: (
        <EvalutionContainer>
          <img src={totem_very_good} />
          <span>Incrível</span>
        </EvalutionContainer>
      ),
      value: 5,
    },
  ];

  const onFinish = async (payload: SaleDto) => {
    setLoading(true);
    setLoading(false);
    setOpenNps(false);
  };

  const onHandleNps = async (score: number) => {
    if (loading) return;
    const updatedSale = { ...sale };
    updatedSale.nps_score = score;
    setSale(updatedSale);
    onFinish(updatedSale);
  };

  return (
    <>
      <Container>
        <Header>
          <span className="span-title">Obrigado</span>
          <span>Pagamento Concluido!</span>
          <span>Curta o seu açai</span>
        </Header>
        <Body>
          <img src={finish_image} />
        </Body>
        <Footer>
          <ButtonNewOrder onClick={() => setStep(1)}>
            Iniciar novo pedido
          </ButtonNewOrder>
        </Footer>
      </Container>
      <Modal
        visible={openNps}
        confirmLoading={loading}
        cancelButtonProps={{ hidden: true }}
        closable={false}
        centered
        width={"62.5rem"}
        style={{ height: "44.56rem" }}
        footer={false}
      >
        <>
          <span className="modal-title">Como foi sua experiência?</span>
          <NpsContainer>
            {npsScores.map((npsScore) => (
              <div
                key={npsScore.id}
                onClick={() => onHandleNps(npsScore.value)}
              >
                {npsScore.element}
              </div>
            ))}
          </NpsContainer>
          <div>
            <Button onClick={() => onFinish(sale)}>Pular</Button>
          </div>
        </>
      </Modal>
    </>
  );
};

export default Evaluation;
