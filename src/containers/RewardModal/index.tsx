import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { notification } from "antd";
import {
  CardReward,
  Modal,
  Container,
  FirstContent,
  GlobalContainer,
  ButtonSearch,
  ImgContent,
  InputSearchReward,
  RewardDescription,
  RewardSearch,
  ButtonCancel,
  RewardContent,
  PlusIcon,
  DecreaseIcon,
  Footer,
  ButtonSave,
  CustomerInfo,
  Header,
  Col,
  PlusIconContainer,
  ColReward,
  ContentItemRow,
} from "./styles";
import { useStore } from "../../hooks/useStore";
import { CustomerReward, Reward } from "../../models/dtos/customerReward";
import Spinner from "../../components/Spinner";

interface IProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

const RewardModal: React.FC<IProps> = ({ isVisible, setIsVisible }) => {
  const [loading, setLoading] = useState(false);
  const [shouldSearch, setShouldSearch] = useState(false);
  const [userCpf, setUserCpf] = useState("");
  const [customerReward, setCustomerReward] = useState<CustomerReward>();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [selectedRewards, setSelectedRewards] = useState<Reward[]>([]);
  const { store } = useStore();

  const getCampaignReward = async () => {
    try {
      if (userCpf.length !== 11) {
        return notification.error({
          message: "O CPF do usuário deve conter 11 dígitos",
          duration: 5,
        });
      }

      setLoading(true);
      const { has_internal_error, error_message, response } =
        await window.Main.sale.getCampaignReward(userCpf);

      if (has_internal_error) {
        setLoading(false);
        return notification.error({
          message: error_message || "Erro ao buscar recompensas",
          duration: 5,
        });
      }

      const { campaignReward, ..._customerReward } = response;
      setCustomerReward(_customerReward);
      setRewards(campaignReward);
      setUserCpf(userCpf);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      notification.error({
        message: "Não foi possível listar a recompensa",
        duration: 5,
      });
    }
  };

  useEffect(() => {
    if (shouldSearch && userCpf) {
      getCampaignReward();
    }
  }, [shouldSearch]);

  const resetModalState = () => {
    setLoading(false);
    setShouldSearch(false);
    setUserCpf("");
    setRewards([]);
    setIsVisible(false);
    setCustomerReward(null);
    setSelectedRewards([]);
  };
  
  const updateUserPoints = (quantity: number) => {
    setCustomerReward((oldState) => ({
      ...oldState,
      quantity: oldState.points_customer + quantity,
    }));
  };

  const getItemQuantity = (product_id: number) => {
    return selectedRewards.filter(
      (selectedReward) => selectedReward.product_id === product_id
    ).length;
  };

  const totalPointsUsed = () => {
    return selectedRewards.reduce(
      (sum, reward) => sum + +reward.points_reward,
      0
    );
  };

  const handleAddReward = (payload: Reward) => {
    setSelectedRewards((oldValues) => [...oldValues, payload]);
    updateUserPoints(payload.points_reward);
  };

  const handleDecressReward = (payload: Reward) => {
    const itemIndex = selectedRewards.findIndex(
      (item) => item.product_id === payload.product_id
    );
    setSelectedRewards((oldValues) => [
      ...oldValues.filter((_, index) => itemIndex !== index),
    ]);
    updateUserPoints(payload.points_reward);
  };

  const useReward = async () => {
    setLoading(true);

    try {
      if (!selectedRewards?.length) {
        return notification.error({
          message: "Selecione um produto para resgatar ou feche o modal",
          duration: 5,
        });
      }
      const _rewards = selectedRewards?.map((item) => ({
        ...item,
        campaign_reward_id: item.id,
      }));
      const payload = {
        customer_reward: _rewards,
        store_id: store.company_id,
        user_name: customerReward?.customer_name,
        user_id: customerReward?.customer_id,
        company_name: store.company.company_name,
      };

      console.log({ payload });

      await window.Main.sale.integrateRewardWithSale(_rewards);
      await window.Main.sale.createCustomerReward(payload);
      notification.success({
        message: "Recompensa resgatada com sucesso",
        duration: 5,
      });
      resetModalState();
      setShouldSearch(true);
    } catch (err) {
      console.log(err);
      notification.error({
        message: "Erro ao resgatar a recompensa",
        duration: 5,
      });
    } finally {
      setShouldSearch(false);
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Recompensas"
      centered
      visible={isVisible}
      onCancel={resetModalState}
      width={"75%"}
      destroyOnClose
      footer={
        <Footer>
          <ButtonCancel onClick={resetModalState}>Cancelar</ButtonCancel>
          <ButtonSave onClick={useReward} disabled={loading}>
            Resgatar recompensa
          </ButtonSave>
        </Footer>
      }
    >
      {loading ? (
        <Spinner />
      ) : (
        <GlobalContainer>
          <RewardSearch>
            <InputSearchReward
              placeholder="Procurar recompensa por cpf"
              value={userCpf}
              onChange={({ target: { value } }) => setUserCpf(value)}
              inputMode="numeric"
            />

            <ButtonSearch onClick={getCampaignReward} disabled={loading}>
              {loading ? "..." : "buscar"}
            </ButtonSearch>
          </RewardSearch>
          <Container>
            <FirstContent>
              <CustomerInfo>
                <div className="first-content">
                  <span>Cliente:</span>
                  <span className="name">
                    {customerReward?.customer_name || "-"}
                  </span>
                </div>
              </CustomerInfo>

              <CustomerInfo>
                <span>Pontos disponíveis</span>
                <span className="result-points">
                  {customerReward?.points_customer || "-"}
                </span>
              </CustomerInfo>

              <CustomerInfo>
                <span>Pontos utilizados</span>
                <span className="result-points">
                  {totalPointsUsed() || "-"}
                </span>
              </CustomerInfo>

              <CustomerInfo>
                <span>Quantidade de itens</span>
                <span className="result-points">
                  {selectedRewards?.length || "-"}
                </span>
              </CustomerInfo>
            </FirstContent>

            {rewards?.length !== 0 && (
              <RewardContent>
                <Header>
                  <Col sm={3}>Imagem</Col>
                  <Col sm={11} style={{ justifyContent: "start" }}>
                    Recompensa
                  </Col>
                  <Col sm={4}>Custo da recompensa</Col>
                  <Col sm={8}>Itens</Col>
                </Header>

                <ContentItemRow>
                  {rewards?.map((item, index) => (
                    <CardReward
                      key={item.id}
                      invalid={
                        item.points_reward > customerReward.points_customer
                      }
                    >
                      <React.Fragment key={item.id}>
                        <ColReward sm={3}>
                          <ImgContent
                            src={item.url_image}
                            alt="imagem da recompensa"
                          />
                        </ColReward>
                        <RewardDescription>
                          <div className="content">
                            <ColReward sm={12}>
                              <div className="contentLeft">
                                {item.description}
                              </div>
                            </ColReward>
                            <ColReward sm={4}>
                              <div className="contentLeft">
                                {item.points_reward}
                              </div>
                            </ColReward>

                            <ColReward sm={3}>
                              <div className="counter">
                                <DecreaseIcon
                                  onClick={() => handleDecressReward(item)}
                                />
                                <p>{getItemQuantity(item.product_id)}</p>
                                <PlusIconContainer
                                  onClick={() => handleAddReward(item)}
                                  disabled={
                                    item.points_reward >
                                    customerReward.points_customer
                                  }
                                >
                                  <PlusIcon />
                                </PlusIconContainer>
                              </div>
                            </ColReward>
                          </div>
                        </RewardDescription>
                      </React.Fragment>
                    </CardReward>
                  ))}
                </ContentItemRow>
              </RewardContent>
            )}
          </Container>
        </GlobalContainer>
      )}
    </Modal>
  );
};

export default RewardModal;
