import React, { useState, Dispatch, SetStateAction } from "react";
import { notification } from "antd";

import pinpad_erase from "../../../../assets/totem/svg/pinpad_erase.svg";
import show_cpf from "../../../../assets/totem/svg/show_cpf.svg";
import hidden_cpf from "../../../../assets/totem/svg/hidden_cpf.svg";

import { validaCPF } from "../../helpers/validaCPF";
import { applyCPFMask } from "../../helpers/applyCPFMask";

import { useSale } from "../../../../hooks/useSale";

import ModalInfo from "../ModalInfo";

import {
  Container,
  Input,
  PinPadOption,
  ShowCPFIcon,
  EraseIcon,
  ButtonSendCPF,
  ButtonDontSendCPF,
  ButtonCancel,
} from "./styles";

interface IProps {
  setStep: Dispatch<SetStateAction<number>>;
  cancelSale: () => void;
  stepChange: (step: number) => void;
}
const Identification: React.FC<IProps> = ({
  setStep,
  cancelSale,
  stepChange,
}) => {
  const { sale, setSale } = useSale();
  const [showCPF, setShowCPF] = useState<boolean>(true);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [cpf, setCpf] = useState(sale?.client_cpf || "");

  const handleSetCpf = (action: string, value?: number) => {
    if (action === "clear-all") {
      setCpf("");
    }
    if (action === "clear-last") {
      if (cpf.length === 1) setCpf("");
      else setCpf((oldValue) => oldValue.slice(0, -1));
    }
    if (action === "add") {
      if (cpf.length === 11) return;
      setCpf((oldValue) => oldValue + value.toString());
    }
  };

  const pinPadOptions = [
    {
      id: 1,
      value: 1,
      action: () => handleSetCpf("add", 1),
    },
    {
      id: 2,
      value: 2,
      action: () => handleSetCpf("add", 2),
    },
    {
      id: 3,
      value: 3,
      action: () => handleSetCpf("add", 3),
    },
    {
      id: 4,
      value: 4,
      action: () => handleSetCpf("add", 4),
    },
    {
      id: 5,
      value: 5,
      action: () => handleSetCpf("add", 5),
    },
    {
      id: 6,
      value: 6,
      action: () => handleSetCpf("add", 6),
    },
    {
      id: 7,
      value: 7,
      action: () => handleSetCpf("add", 7),
    },
    {
      id: 8,
      value: 8,
      action: () => handleSetCpf("add", 8),
    },
    {
      id: 9,
      value: 9,
      action: () => handleSetCpf("add", 9),
    },
    {
      id: 10,
      value: "Limpar",
      action: () => handleSetCpf("clear-all"),
    },
    {
      id: 11,
      value: 0,
      action: () => handleSetCpf("add", 0),
    },
    {
      id: 12,
      value: <EraseIcon src={pinpad_erase} />,
      action: () => handleSetCpf("clear-last"),
    },
  ];

  const onFinish = async (useCpf: boolean) => {
    if (useCpf) {
      if (!validaCPF(cpf)) {
        return notification.warning({
          message: "CPF inválido",
          description:
            "Para prosseguir é necessário informar um cpf válido ou remover o informado",
          duration: 5,
          className: "notification-totem",
        });
      }
    }

    const { response: updatedSale } = await window.Main.sale.updateSale(
      sale.id,
      {
        ...sale,
        client_cpf: useCpf && cpf ? cpf : null,
        cpf_used_nfce: false,
        cpf_used_club: useCpf,
      }
    );

    setSale(updatedSale);

    sale.items.length ? setStep(4) : stepChange(3);
  };

  return (
    <>
      <Container>
        <span className="title">Gostaria de se Identificar?</span>
        <div className="user-info">
          <span>INFORME SEU NÚMERO DE CPF</span>
          <div className="inputContainer">
            <Input value={applyCPFMask(cpf, showCPF)} disabled />
            <button onClick={() => setShowCPF(!showCPF)}>
              {showCPF ? (
                <ShowCPFIcon src={show_cpf} />
              ) : (
                <ShowCPFIcon src={hidden_cpf} />
              )}
            </button>
          </div>
        </div>
        <div className="pin-pad">
          {pinPadOptions.map((pinPadOption) => (
            <PinPadOption
              key={pinPadOption.id}
              onClick={pinPadOption.action}
              letters={pinPadOption.id === 10}
            >
              {pinPadOption.value}
            </PinPadOption>
          ))}
        </div>
        {sale.items.length ? (
          <div className="actions-step4">
            <ButtonCancel
              onClick={() => onFinish(false)}
              style={{ width: "28.43rem", margin: "0 1rem" }}
            >
              {cpf.length === 11 ? "Remover CPF" : "Não desejo Informar"}
            </ButtonCancel>
            <ButtonSendCPF
              onClick={() => onFinish(true)}
              style={{ width: "28.43rem", margin: "0 1rem" }}
              disabled={cpf.length !== 11}
            >
              Continuar
            </ButtonSendCPF>
          </div>
        ) : (
          <div className="actions">
            <ButtonSendCPF
              onClick={() => onFinish(true)}
              disabled={cpf.length !== 11}
            >
              Confirmar
            </ButtonSendCPF>
            <ButtonDontSendCPF onClick={() => onFinish(false)}>
              Não desejo Informar
            </ButtonDontSendCPF>
          </div>
        )}
        <div className="information-content">
          <span>
            A inserção do CPF é opcional. Inseri-lo permite a nós verificarmos
            se você é participante do Clube The Best, onde você pode acumular
            pontos e trocá-los por <b>recompensas</b>! Você ainda pode inseri-lo
            no cupom fiscal ao final da compra.
          </span>
        </div>
        <div className="cancel-order">
          <ButtonCancel onClick={() => setVisibleModal(true)}>
            Cancelar Pedido
          </ButtonCancel>
        </div>
      </Container>
      <ModalInfo
        visible={visibleModal}
        setVisible={setVisibleModal}
        cancelSale={cancelSale}
      />
    </>
  );
};

export default Identification;
