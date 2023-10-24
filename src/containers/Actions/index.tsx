import React, { useState, useEffect } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

import { useUser } from "../../hooks/useUser";
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
  DiscountIcon,
  CpfContent,
  CpfContetGeneral,
  ContentGeneral,
  IdIcon,
} from "./styles";

import { useSale } from "../../hooks/useSale";
import { useStore } from "../../hooks/useStore";
import RewardModal from "../RewardModal";
import CupomModal from "../CupomModal";
import ClientCPFInfo from "../../components/ClientCPFInfo";
import { SaleDto } from "../../models/dtos/sale";
import { monetaryFormat } from "../../helpers/monetaryFormat";

type ComponentProps = RouteComponentProps;

const Actions: React.FC<ComponentProps> = ({ history }) => {
  const { discountModalHandler, sale, campaign, setCampaign, setShouldOpenClientInfo } = useSale();
  const [cupomModalState, setCupomModalState] = useState(false)
  const { store } = useStore();
  const [cash, setCash] = useState<string | undefined>("");
  const [username, setUsername] = useState<SaleDto>();
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

  useEffect(() => {
    const fetchCampaign = async () => {
      const { response } = await window.Main.sale.getCurrentCampaign();
      if (response) {
        setCampaign(response);
      }
    };

    if (!campaign) {
      fetchCampaign();
    }
  }, [campaign]);

  const getCampaignPointsPlus = () => {
    let points = Math.floor(sale.total_sold / campaign.average_ticket);
    points += 1;
    points *= campaign.average_ticket;
    points -= sale.total_sold;
    return points;
  };

  useEffect(() => {
    const getCustomerName = async () => {
      const { response } =
        await window.Main.user.getCustomerByCpf(sale.client_cpf);
      setUsername(response)
    }

    getCustomerName()
  }, [sale.client_cpf])

  return (
    <Container>
      <ContentGeneral>
        <ActionButtons>
          <CpfContetGeneral>
            <Button onClick={() => setShouldOpenClientInfo(true)}>
              <IdIcon />
              Inserir CPF [i]
            </Button>

            <Button
              onClick={() =>
                setCupomModalState((oldValue) => {
                  return !oldValue;
                })
              }
            >
              <DiscountIcon />
              Cupom [C]
            </Button>

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
          </CpfContetGeneral>

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
        </ActionButtons>

        <CpfContent>
          <span>Nome: {sale.client_cpf ? username?.name : "Não informado"}</span> {" "}

          <span>CPF: {sale.client_cpf ? sale.client_cpf : "Não informado"}</span>

          <div>
            {campaign && sale.client_cpf ? (
              <div>
                Com mais
                <span>R$ {monetaryFormat(getCampaignPointsPlus())} </span>
                <span>você ganha +1 ponto</span>
                <div className="totalPoints">Pontos ganhos nessa compra: {Math.floor(
                  sale.total_sold / campaign.average_ticket,
                )}</div>

              </div>
            ) : null}
          </div>
        </CpfContent>
      </ContentGeneral>

      <DiscountForm />
      <CupomModal
        cupomModalState={cupomModalState}
        setCupomModalState={setCupomModalState}
      />
      <ClientCPFInfo
        campaign={campaign}
        getCampaignPointsPlus={getCampaignPointsPlus}
      />
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

      <RewardModal isVisible={rewardModal} setIsVisible={setRewardModal} />

      <ChatForm isVisible={openChat} setIsVisible={setOpenChat} />
    </Container >
  );
};

export default withRouter(Actions);
