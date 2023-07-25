import React, { useState, useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import { RouteComponentProps, withRouter } from "react-router-dom";

import RegistrationCard from "../RegistrationCard";
import DiscountForm from "../DiscountForm";
import InOutForm from "../InOutForm";

import ChatForm from "../ChatForm";

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
  TrophyIcon,
} from "./styles";

import { useSale } from "../../hooks/useSale";
import { useStore } from "../../hooks/useStore";
import RewardModal from "../RewardModal";

type ComponentProps = RouteComponentProps;

const Actions: React.FC<ComponentProps> = ({ history }) => {
  const { discountModalHandler } = useSale();
  const { store } = useStore();
  const { user } = useUser();
  const [cash, setCash] = useState<string | undefined>("");
  const [commandState, setCommandState] = useState(false);
  const [handlerInState, setHandlerInState] = useState(false);
  const [handlerOutState, setHandlerOutState] = useState(false);
  const [rewardModal, setRewardModal] = useState(false);
  const [openChat, setOpenChat] = useState(false);

  useEffect(() => {
    async function init() {
      const { response: storeCash } = await window.Main.storeCash.getCurrent();
      setCash(storeCash?.is_opened ? "ABERTO" : "FECHADO");
    }
    init();
  }, [history.location]);

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

        <Button onClick={() => setRewardModal(true)}>
          <TrophyIcon />
          Recompensas
        </Button>
      </ActionButtons>

      <InfosAndChat>
        <ContentHeaderInfos>
          <InfoStore>
            {store?.company?.company_name?.toUpperCase()} <br />
            <span
              style={{
                color: cash === "ABERTO" ? "green" : "red",
              }}
            >
              {cash}
            </span>
          </InfoStore>
        </ContentHeaderInfos>
      </InfosAndChat>

      <DiscountForm />

      <RegistrationCard
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

      <RewardModal isVisible={rewardModal} setIsVisible={setRewardModal}/>

      <ChatForm isVisible={openChat} setIsVisible={setOpenChat} />
    </Container>
  );
};

export default withRouter(Actions);
