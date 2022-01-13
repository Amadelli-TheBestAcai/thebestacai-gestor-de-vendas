import React, { useState, useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import { RouteComponentProps, withRouter } from "react-router-dom";

import RegistrationCard from "../RegistrationCard";
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

import { useSale } from "../../hooks/useSale";

type ComponentProps = RouteComponentProps;

const Actions: React.FC<ComponentProps> = ({ history }) => {
  const { sale, discountModalHandler, onAddToQueue } = useSale();
  const { user } = useUser();
  const [store, setStore] = useState<string | undefined>(undefined);
  const [cash, setCash] = useState<string | undefined>("");
  const [commandState, setCommandState] = useState(false);
  const [handlerInState, setHandlerInState] = useState(false);
  const [handlerOutState, setHandlerOutState] = useState(false);
  const [openChat, setOpenChat] = useState(false);

  useEffect(() => {
    async function init() {
      const registratedStore = await window.Main.store.hasRegistration();
      const storeCash = await window.Main.storeCash.getCurrent();
      setCash(storeCash?.is_opened ? "ABERTO" : "FECHADO");
      setStore(registratedStore.company.company_name);
    }
    init();
  }, [history.location]);

  const handleCommand = () => {
    if (!sale.items.length) {
      return message.warning("A lista de itens está vazia");
    }
    setCommandState(true);
  };

  return (
    <Container>
      <ActionButtons>
        <Button onClick={() => discountModalHandler.openDiscoundModal()}>
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
        <Button onClick={() => setCommandState(true)}>
          <ListIcon />
          Comanda
        </Button>
      </ActionButtons>

      <InfosAndChat>
        <ContentHeaderInfos>
          <InfoStore>
            {/* {store.toUpperCase()} <br /> */}
            <span
              style={{
                color: cash === "ABERTO" ? "green" : "red",
              }}
            >
              {cash}
            </span>
          </InfoStore>

          <ChatContainer>
            <ChatIcon />
            <UserPhoto
              src={
                user?.image
                  ? user?.image
                  : "https://www.ecp.org.br/wp-content/uploads/2017/12/default-avatar-1.png"
              }
            />
          </ChatContainer>
        </ContentHeaderInfos>
      </InfosAndChat>
      <DiscountForm />
      <InputForm
        placeHolder="Digite o nome do cliente"
        onFinish={onAddToQueue}
        modalState={commandState}
        setModalState={setCommandState}
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

export default withRouter(Actions);
