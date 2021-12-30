import React, { useState, Dispatch, SetStateAction } from "react";

import InputForm from "../InputForm";
import DiscountForm from "../DiscountForm";
import InOutForm from "../InOutForm";

import { message } from "antd";

import {
  Container,
  ActionButtons,
  InfosAndChat,
  Button,
  OfferIcon,
  InputIcon,
  OutputIcon,
  ListIcon,
  ContentHeaderInfos,
  InfoStore,
  ChatContainer,
  ChatIcon,
  UserPhoto,
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
      <ActionButtons>
        <Button onClick={() => setDiscountState(true)}>
          <OfferIcon />
          Desconto [R]
        </Button>

        <Button onClick={() => setHandlerInState(true)}>
          <InputIcon />
          Entrada
        </Button>

        <Button onClick={() => setHandlerOutState(true)}>
          <OutputIcon />
          Saída
        </Button>
        <Button>
          <ListIcon />
          Comanda
        </Button>
      </ActionButtons>

      <InfosAndChat>
        <ContentHeaderInfos>
          <InfoStore>LOJA TESTE </InfoStore>
          <hr />
          <ChatContainer>
            <ChatIcon />
            <UserPhoto />
          </ChatContainer>
        </ContentHeaderInfos>
      </InfosAndChat>

      {/* <InputForm
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
      /> */}
    </Container>
  );
};

export default Actions;
