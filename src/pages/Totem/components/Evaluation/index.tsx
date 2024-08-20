import React, { useState, Dispatch, SetStateAction } from "react";

import { Container, Button, Modal, NpsContainer } from "./styles";
import { notification } from "antd";

import { SaleDto } from "../../../../models/dtos/sale";
import { SalesTypes } from "../../../../models/enums/salesTypes";

interface IProps {
  setStep: Dispatch<SetStateAction<number>>;
  sale: SaleDto | null;
  setSale: Dispatch<SetStateAction<SaleDto | null>>;
}
const Evaluation: React.FC<IProps> = ({ setStep, sale, setSale }) => {
  const [loading, setLoading] = useState(false);
  const [openNps, setOpenNps] = useState(true);

  const npsScores = [
    { id: 1, element: <span>Péssima</span>, value: 1 },
    { id: 2, element: <span>Ruim</span>, value: 2 },
    { id: 3, element: <span>Regular</span>, value: 3 },
    { id: 4, element: <span>Boa</span>, value: 4 },
    { id: 5, element: <span>Incrível</span>, value: 5 },
  ];

  const onFinish = async (payload: SaleDto) => {
    setLoading(true);
    const { has_internal_error: errorOnFinishSale, error_message } =
      await window.Main.sale.finishSale({
        ...payload,
        formated_type: SalesTypes[payload.type],
      });

    if (errorOnFinishSale) {
      error_message
        ? notification.warning({
            message: error_message,
            duration: 5,
          })
        : notification.error({
            message: "Erro ao finalizar venda",
            duration: 5,
          });
    }
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
        onOk={() => onFinish(sale)}
        okText="Pular"
        confirmLoading={loading}
        cancelButtonProps={{ hidden: true }}
        closable={false}
      >
        <NpsContainer>
          {npsScores.map((npsScore) => (
            <div key={npsScore.id} onClick={() => onHandleNps(npsScore.value)}>
              {npsScore.element}
            </div>
          ))}
        </NpsContainer>
      </Modal>
    </>
  );
};

export default Evaluation;
