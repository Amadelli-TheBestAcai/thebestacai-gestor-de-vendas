import React, { Dispatch, SetStateAction } from "react";

import { Container, ButtonContinue, ButtonCancel } from "./styles";

interface IProps {
  type: string;
  text?: string;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  setStep: Dispatch<SetStateAction<number>>;
}
const ModalInfo: React.FC<IProps> = ({
  setStep,
  visible,
  setVisible,
  type,
}) => {
  return (
    <Container
      visible={visible}
      closable={false}
      centered
      width={"62.5rem"}
      style={{ height: "34.56rem" }}
      footer={false}
    >
      <>
        <span className="modal-title">{"Cancelar pedido?"}</span>
        <span className="modal-body">
          {"Tem certeza que deseja cancelar seu pedido?"}
        </span>
        <span className="modal-body">{"Todos os dados serão perdidos."}</span>

        <div className="modal-footer">
          <ButtonCancel
            onClick={() => {
              setStep(1), setVisible(false);
            }}
          >
            Cancelar Pedido
          </ButtonCancel>
          <ButtonContinue onClick={() => setVisible(false)}>
            Continuar Pedido
          </ButtonContinue>
        </div>
      </>
    </Container>
  );
};

export default ModalInfo;
