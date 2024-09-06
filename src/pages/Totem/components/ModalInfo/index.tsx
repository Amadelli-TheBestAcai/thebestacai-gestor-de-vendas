import React, { Dispatch, SetStateAction } from "react";

import { Container, ButtonContinue, ButtonCancel } from "./styles";

interface IProps {
  text?: string;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  cancelSale: () => void;
}
const ModalInfo: React.FC<IProps> = ({
  visible,
  setVisible,
  cancelSale,
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
        <div className="modal-div-body">
          <span className="modal-body">
            {"Tem certeza que deseja cancelar seu pedido?"}
          </span>
          <span className="modal-body">{"Todos os dados serão perdidos."}</span>
        </div>

        <div className="modal-footer">
          <ButtonCancel
            onClick={() => {
              cancelSale(), setVisible(false);
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
