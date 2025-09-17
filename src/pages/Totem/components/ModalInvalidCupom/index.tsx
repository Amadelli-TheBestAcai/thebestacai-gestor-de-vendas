import React, { Dispatch, SetStateAction } from "react";

import { Container, ButtonContinue, ButtonCancel } from "./styles";

interface IProps {
  text?: string;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  returnCheckOut: () => void;
}
const ModalInvalidCupom: React.FC<IProps> = ({
  text,
  visible,
  setVisible,
  returnCheckOut,
}) => {
  return (
    <Container
      visible={visible}
      closable={false}
      centered
      width={"62.5rem"}
      style={{ height: "40rem" }}
      footer={false}
    >
      <>
        <span className="modal-title">{"Cupom Inválido!"}</span>
        <div className="modal-div-body">
          <span className="modal-body">
            {text || "O cupom inserido não é válido"}
          </span>
        </div>

        <div className="modal-footer">
          <ButtonCancel
            onClick={() => {
              setVisible(false), returnCheckOut();
            }}
          >
            Cancelar
          </ButtonCancel>
          <ButtonContinue onClick={() => setVisible(false)}>
            Corrigir
          </ButtonContinue>
        </div>
      </>
    </Container>
  );
};

export default ModalInvalidCupom;
