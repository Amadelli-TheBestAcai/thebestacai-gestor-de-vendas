import React, { Dispatch, SetStateAction } from "react";

import { Container, ButtonContinue } from "./styles";

interface IProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}
const ModalCupomInfo: React.FC<IProps> = ({
  visible,
  setVisible,
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
        <span className="modal-title">{"Cupom aplicado"}</span>
        <div className="modal-div-body">
          <span className="modal-body">
            {
              "Para realizar modificações em sua compra, é necessário remover o cupom."
            }
          </span>
        </div>

        <div className="modal-footer">
          <ButtonContinue onClick={() => setVisible(false)}>
            Entendido
          </ButtonContinue>
        </div>
      </>
    </Container>
  );
};

export default ModalCupomInfo;
