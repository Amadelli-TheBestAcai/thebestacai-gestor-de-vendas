import React, { useState, Dispatch, SetStateAction } from "react";
import { notification } from "antd";

import { SaleDto } from "../../../../models/dtos/sale";

import { Container, Input, Button, PinPadOption, ShowPasswordIcon } from "./styles";

import { applyCPFMask } from "../../helpers/applyCPFMask";

import show_password from "../../../../assets/totem/svg/show_password.svg";

interface IProps {
  setStep: Dispatch<SetStateAction<number>>;
  setSale: Dispatch<SetStateAction<SaleDto | null>>;
  sale: SaleDto | null;
}
const Identification: React.FC<IProps> = ({ setStep, setSale, sale }) => {
  const [showCPF, setShowCPF] = useState<boolean>(false);
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
      value: "clean",
      action: () => handleSetCpf("clear-all"),
    },
    {
      id: 11,
      value: 0,
      action: () => handleSetCpf("add", 0),
    },
    {
      id: 12,
      value: "< x",
      action: () => handleSetCpf("clear-last"),
    },
  ];

  const onFinish = (useCpf: boolean) => {
    if (useCpf) {
      if (cpf.length !== 11) {
        return notification.warning({
          message:
            "Para prosseguir é necessário informar um cpf ou remover o informado",
          duration: 5,
        });
      } else {
        setSale((oldValues) => ({
          ...oldValues,
          client_cpf: cpf,
          cpf_used_club: true,
        }));
      }
    } else {
      setSale((oldValues) => ({
        ...oldValues,
        client_cpf: null,
        cpf_used_club: false,
      }));
    }
    setStep(sale.items.length ? 4 : 3);
  };

  return (
    <Container>
      <span className="title">Gostaria de se Identificar?</span>
      <div className="user-info">
        <span>INFORME SEU NÚMERO DE CPF</span>
        <div className="inputContainer">
          <Input value={applyCPFMask(cpf, showCPF)} disabled />
          <Button onClick={() => setShowCPF(!showCPF)}><ShowPasswordIcon src={show_password}/></Button>
        </div>
      </div>
      <div className="pin-pad">
        {pinPadOptions.map((pinPadOption) => (
          <PinPadOption key={pinPadOption.id} onClick={pinPadOption.action}>
            {pinPadOption.value}
          </PinPadOption>
        ))}
      </div>
      <div className="actions">
        <Button onClick={() => onFinish(true)}>Confirmar</Button>
        <Button onClick={() => onFinish(false)}>Não desejo Informar</Button>
      </div>
      <div className="information-content">
        <span>
          A inserção do cpf é opcional. Inseri-lo permite a nós verificarmos se
          você é participante do Clube The Best e você ainda pode inseri-lo no
          cupom fiscal ao final da compra
        </span>
      </div>
      <div className="cancel-order">
        <Button onClick={() => setStep(1)}>Cancelar Pedido</Button>
      </div>
    </Container>
  );
};

export default Identification;
