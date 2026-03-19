import React, { Dispatch, SetStateAction } from "react";

import finish_image_easter from "../../../../assets/totem/svg/finish_image_easter.svg";

import { Container, ButtonContinue, ButtonCancel } from "./styles";

interface IProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  onRegisterWeight: () => void;
  loading: boolean;
}

const ModalWeight: React.FC<IProps> = ({
  visible,
  setVisible,
  onRegisterWeight,
  loading,
}) => {
  return (
    <Container
      visible={visible}
      centered
      closable={false}
      width={"62.5rem"}
      style={{ height: "34.56rem" }}
      footer={false}
    >
      <>
        <span className="modal-title">{"Bem-vindo a The Best Açaí!"}</span>
        <div className="modal-div-body">
          <span className="modal-body">{"Coloque seu açaí na balança"}</span>
          <span className="modal-body">
            {"e pressione o botão "}
            <span style={{fontWeight:"bold"}}>Registrar Pesagem</span>
          </span>
          <img src={finish_image_easter} />
          <span className="modal-body">{"Ou prossiga sem pesagem"}</span>
          <span className="modal-body">{"caso apenas deseje aproveitar "}</span>
          <span className="modal-body">
            {"nossas bebidas, potes e outros produtos"}
          </span>
        </div>

        <div className="modal-footer">
          <ButtonContinue
            onClick={onRegisterWeight}
            loading={loading}
            loadingRegister={loading}
          >
            Registrar Pesagem
          </ButtonContinue>
          <ButtonCancel onClick={() => setVisible(false)} disabled={loading}>
            Prosseguir sem pesagem
          </ButtonCancel>
        </div>
      </>
    </Container>
  );
};

export default ModalWeight;
