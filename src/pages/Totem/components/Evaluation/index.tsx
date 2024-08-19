import React, { useState, Dispatch, SetStateAction } from "react";

import { Container, Button, Modal, NpsContainer } from "./styles";

interface IProps {
  setStep: Dispatch<SetStateAction<number>>;
}
const Evaluation: React.FC<IProps> = ({ setStep }) => {
  const [openNps, setOpenNps] = useState(true);

  const npsScores = [
    { id: 1, element: <span>Péssima</span>, value: 1 },
    { id: 2, element: <span>Ruim</span>, value: 2 },
    { id: 3, element: <span>Regular</span>, value: 3 },
    { id: 4, element: <span>Boa</span>, value: 4 },
    { id: 5, element: <span>Incrível</span>, value: 5 },
  ];

  return (
    <>
      <Container>
        <div className="header">
          <span>Obrigado</span>
          <span>Pagamento Concluido!</span>
          <span>Curta o seu açai</span>
        </div>
        <div className="content">Imagem legal</div>
        <div className="footer">
          <Button onClick={() => setStep(1)}>Iniciar novo pedido</Button>
        </div>
      </Container>
      <Modal
        visible={openNps}
        onOk={() => setOpenNps(false)}
        okText="Pular"
        cancelButtonProps={{ hidden: true }}
        closable={false}
      >
        <NpsContainer>
          {npsScores.map((npsScore) => (
            <div key={npsScore.id}>{npsScore.element}</div>
          ))}
        </NpsContainer>
      </Modal>
    </>
  );
};

export default Evaluation;
