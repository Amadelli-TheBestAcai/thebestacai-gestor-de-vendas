import React, { useState, useEffect } from "react";
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
  DiscountIcon,
  CpfContent,
  CpfContetGeneral,
  ContentGeneral,
  IdIcon,
  ContentPointsInfo,
  ContentUserInfo,
  ButtonCommands,
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
  const {
    discountModalHandler,
    sale,
    campaign,
    setCampaign,
    setShouldOpenClientInfo,
    storeCash,
    setStoreCash,
  } = useSale();
  const [cupomModalState, setCupomModalState] = useState(false);
  const { store } = useStore();
  const [cash, setCash] = useState<string | undefined>("");
  const [username, setUsername] = useState<SaleDto>();
  const [commandState, setCommandState] = useState(false);
  const [handlerInState, setHandlerInState] = useState(false);
  const [handlerOutState, setHandlerOutState] = useState(false);
  const [rewardModal, setRewardModal] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const { openedStepSale } = useSale();

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
      const { response } = await window.Main.user.getCustomerByCpf(
        sale.client_cpf
      );
      setUsername(response);
    };

    if (sale.client_cpf) {
      getCustomerName();
    }
  }, [sale.client_cpf]);

  const modalReward = async () => {
    if (!storeCash.is_online) {
      const { response: _storeCash } = await window.Main.storeCash.getCurrent();

      if (_storeCash && _storeCash.is_online) {
        setStoreCash(_storeCash);
      }
    }

    setRewardModal(true);
  };

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
            <ButtonCommands onClick={() => setCommandState(true)}>
              <ListIcon />
              Comanda{" "}
              {openedStepSale > 0 && (
                <span className="badge">{openedStepSale}</span>
              )}
            </ButtonCommands>

            <Button onClick={() => modalReward()}>
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

        <CpfContent haveCpf={sale.client_cpf}>
          <ContentUserInfo>
            <span>
              <b>Nome:</b> {sale.client_cpf ? username?.name : "Não informado"}
            </span>{" "}
            <span>
              <b>CPF:</b> {sale.client_cpf ? sale.client_cpf : "Não informado"}
            </span>
          </ContentUserInfo>

          <ContentPointsInfo>
            {campaign && sale.client_cpf ? (
              <>
                <span>
                  Com mais R$ {monetaryFormat(getCampaignPointsPlus())} você
                  ganha +1 ponto.
                </span>
                <span>
                  <b>Pontos ganhos nessa compra: </b>
                  {Math.floor(sale.total_sold / campaign.average_ticket)}
                </span>
              </>
            ) : (
              <span>
                <b>*Insira um CPF, e ganhe pontos!</b>
              </span>
            )}
          </ContentPointsInfo>
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
    </Container>
  );
};

export default withRouter(Actions);
