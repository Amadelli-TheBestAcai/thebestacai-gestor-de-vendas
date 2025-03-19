import React, { Dispatch, SetStateAction, useState } from "react";

import { Container, ButtonContinue, ButtonCancel } from "./styles";
import { notification } from "antd";

interface IProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  setStep: (number) => void;
}
const ModalCupomChange: React.FC<IProps> = ({
  visible,
  setVisible,
  setStep,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const onChangeCupom = async () => {
    setLoading(true);
    try {
      setStep(4.5);
    } catch (e) {
      notification.error({
        message: "Ops! Algo deu errado.",
        description:
          "Não foi possível remover o cupom. Por favor informe o atendente",
        duration: 5,
        className: "notification-totem",
      });
    } finally {
      setLoading(false);
    }
  };

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
        <span className="modal-title">{"Trocar Cupom?"}</span>
        <div className="modal-div-body">
          <span className="modal-body">
            Só é permitido um cupom por pedido. <br />
            Pretende trocar o cupom usado no pedido?
          </span>
        </div>

        <div className="modal-footer">
          <ButtonCancel
            onClick={() => {
              setVisible(false);
            }}
            disabled={loading}
          >
            Cancelar
          </ButtonCancel>
          <ButtonContinue onClick={() => onChangeCupom()} loading={loading}>
            Trocar
          </ButtonContinue>
        </div>
      </>
    </Container>
  );
};

export default ModalCupomChange;
