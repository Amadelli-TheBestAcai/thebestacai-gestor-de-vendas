import React, { useState, Dispatch, SetStateAction } from "react";

import InputForm from "../InputForm";
import DiscountForm from "../DiscountForm";
import InOutForm from "../InOutForm";

import { message } from "antd";

import {
  Container,
  DiscountButton,
  EntryButton,
  CommandButton,
  OutButton,
  OfferIcon,
  EntryIcon,
  OutIcon,
  CommandIcon,
  ChatIcon,
} from "./styles";

type IProps = {
  haveItensOnSale: boolean;
  addToQueue: (name: string) => void;
  addDiscount: (value: number) => void;
  discountState: boolean;
  setDiscountState: Dispatch<SetStateAction<boolean>>;
};

const Actions: React.FC<IProps> = ({
  haveItensOnSale,
  addToQueue,
  addDiscount,
  discountState,
  setDiscountState,
}) => {
  const [commandState, setCommandState] = useState(false);
  const [handlerInState, setHandlerInState] = useState(false);
  const [handlerOutState, setHandlerOutState] = useState(false);
  const [openChat, setOpenChat] = useState(false);

  const handleCommand = () => {
    if (!haveItensOnSale) {
      return message.warning("A lista de itens está vazia");
    }
    setCommandState(true);
  };

  return (
    <Container>
      <DiscountButton
        onClick={() => setDiscountState(true)}
        style={{ fontSize: "12px" }}
      >
        [R] DESCONTO
        <OfferIcon />
      </DiscountButton>
      <EntryButton onClick={() => setHandlerInState(true)}>
        ENTRADA
        <EntryIcon />
      </EntryButton>
      <OutButton onClick={() => setHandlerOutState(true)}>
        SAÍDA
        <OutIcon />
      </OutButton>
      <CommandButton onClick={() => handleCommand()}>
        COMANDA
        <CommandIcon />
      </CommandButton>
      <CommandButton onClick={() => setOpenChat(!openChat)}>
        Chat
        <ChatIcon />
      </CommandButton>

      <InputForm
        placeHolder="Digite o nome do cliente"
        onFinish={addToQueue}
        modalState={commandState}
        setModalState={setCommandState}
      />
      <DiscountForm
        onFinish={addDiscount}
        modalState={discountState}
        setModalState={setDiscountState}
      />
      <InOutForm
        type="entrada"
        modalState={handlerInState}
        setModalState={setHandlerInState}
      />
      <InOutForm
        type="saida"
        modalState={handlerOutState}
        setModalState={setHandlerOutState}
      />
    </Container>
  );
};

export default Actions;
