import React, { Dispatch, SetStateAction, useState } from "react";

import { Container, ButtonContinue, ButtonCancel } from "./styles";
import { notification } from "antd";
import { useSale } from "../../../../hooks/useSale";

interface IProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}
const ModalRemoveCupom: React.FC<IProps> = ({ visible, setVisible }) => {
  const { sale, setSale } = useSale();
  const [loading, setLoading] = useState<boolean>(false);

  const onDeleteCupom = async () => {
    setLoading(true);
    try {
      setLoading(true);
      const newTotal = sale.items.reduce(
        (total, item) => item.total + total,
        0
      );

      const payload = {
        ...sale,
        discount: 0,
        customerVoucher: null,
        total_sold: newTotal,
      };

      const { response: _sale, has_internal_error: errorOnUpdateSale } =
        await window.Main.sale.updateSale(sale.id, payload);

      if (errorOnUpdateSale) {
        return  notification.error({
          message: "Ops! Algo deu errado.",
          description:
            "Não foi possível remover o cupom. Por favor informe o atendente",
          duration: 5,
          className: "notification-totem",
        });
      }

      setSale(_sale);

      notification.info({
        message: "Você cancelou a utilização do cupom!",
        description: "Ele ainda poderá ser utilizado",
        duration: 5,
        className: "notification-totem",
      });

      setVisible(false);
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
      maskClosable={false}
      width={"62.5rem"}
      style={{ height: "40rem" }}
      footer={false}
    >
      <>
        <span className="modal-title">{"Deseja remover esse cupom?"}</span>
        <div className="modal-div-body">
          <span className="modal-body">
            Após a remoção é possível adicionar outro cupom.
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
          <ButtonContinue onClick={() => onDeleteCupom()} loading={loading}>
            Remover
          </ButtonContinue>
        </div>
      </>
    </Container>
  );
};

export default ModalRemoveCupom;
