import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { notification } from "antd";
import { useSale } from "../../hooks/useSale";
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
} from "./styles";
import { useStore } from "../../hooks/useStore";
import { CustomerReward } from "../../models/dtos/customerReward";
import Spinner from "../../components/Spinner";

interface IProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

const RewardModal: React.FC<IProps> = ({ isVisible, setIsVisible }) => {
  const { sale } = useSale();
  const [loading, setLoading] = useState(false);
  const [shouldSearch, setShouldSearch] = useState(false);
  const [rewardCounts, setRewardCounts] = useState<number[]>([]);
  const [userCpf, setUserCpf] = useState("");
  const [searchingReward, setSearchingReward] = useState(false);
  const [rewards, setRewards] = useState<CustomerReward | undefined>(undefined);
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
      setSearchingReward(true);
      const { has_internal_error, error_message, response } =
        await window.Main.sale.getCampaignReward(userCpf);

      if (has_internal_error) {
        setSearchingReward(false);
        setLoading(false);
        return notification.error({
          message: error_message || "Erro ao buscar recompensas",
          duration: 5,
        });
      }
      const initialCounts = response?.campaignReward.map(() => 0) || [];

      setUserCpf(userCpf);
      setRewards(response);
      setRewardCounts(initialCounts);
      setSearchingReward(false);
      setLoading(false);
    } catch (error) {
      setSearchingReward(false);
      setLoading(false);
      notification.error({
        message: "Não foi possível listar a recompensa",
        duration: 5,
      });
    }
  };

  useEffect(() => {
    if (userCpf) {
      getCampaignReward();
    }
  }, [shouldSearch]);

  const totalPoints = rewards?.campaignReward.reduce(
    (acc, item, index) => acc + item.points_reward * rewardCounts[index],
    0
  );

  const isAnyCardDisabled = rewardCounts.some(
    (count, index) =>
      count * rewards?.campaignReward[index].points_reward >=
      rewards?.points_customer
  );

  const useReward = async () => {
    setLoading(true);

    try {
      if (!rewardCounts.some((count) => count > 0)) {
        return notification.error({
          message: "Selecione um produto para resgatar ou feche o modal",
          duration: 5,
        });
      }
      const customer_reward = rewardCounts.reduce((result, count, index) => {
        if (count > 0) {
          result.push({
            customer_id: rewards?.customer_id,
            customer_campaign_id: rewards?.customer_campaign_id,
            campaign_reward_id: rewards?.campaignReward[index].id,
          });
        }
        return result;
      }, []);

      const payload = {
        customer_reward,
        store_id: store.company_id,
        user_name: rewards?.customer_name,
        user_id: rewards?.customer_id,
        company_name: store.company.company_name,
      };

      const selectedCampaignReward = rewards?.campaignReward.filter(
        (item, index) => rewardCounts[index] > 0
      );

      const productsIds = selectedCampaignReward.map((item) => item.product_id);

      await window.Main.sale.integrateRewardWithSale(sale, productsIds);
      await window.Main.sale.createCustomerReward(payload);
      notification.success({
        message: "Recompensa resgatada com sucesso",
        duration: 5,
      });
      resetModalState();
      setShouldSearch(true);
    } catch (err) {
      notification.error({
        message: "Erro ao resgatar a recompensa",
        duration: 5,
      });
    } finally {
      setShouldSearch(false);
      setLoading(false);
    }
  };

  const updateCounter = (index, newValue) => {
    setRewardCounts((prevCounts) => {
      const newCounts = [...prevCounts];
      newCounts[index] = newValue;
      return newCounts;
    });
  };

  const resetModalState = () => {
    setLoading(false);
    setShouldSearch(false);
    setRewardCounts([]);
    setUserCpf("");
    setSearchingReward(false);
    setRewards(undefined);
    setIsVisible(false);
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
            />

            <ButtonSearch onClick={getCampaignReward} disabled={loading}>
              {searchingReward ? "..." : "buscar"}
            </ButtonSearch>
          </RewardSearch>
          <Container>
            <FirstContent>
              <CustomerInfo>
                <div className="first-content">
                  <span>Cliente:</span>
                  <span className="name">{rewards?.customer_name || "-"}</span>
                </div>
              </CustomerInfo>

              <CustomerInfo>
                <span>Pontos disponíveis</span>
                <span className="result-points">
                  {rewards?.points_customer || "-"}
                </span>
              </CustomerInfo>

              <CustomerInfo>
                <span>Pontos utilizados</span>
                <span className="result-points">{totalPoints || "-"}</span>
              </CustomerInfo>

              <CustomerInfo>
                <span>Quantidade de itens</span>
                <span className="result-points">
                  {rewards?.campaignReward.length || "-"}
                </span>
              </CustomerInfo>
            </FirstContent>

            {rewards?.campaignReward && rewards.campaignReward.length !== 0 && (
              <RewardContent>
                <Header>
                  <Col sm={3}>Imagem</Col>
                  <Col sm={11} style={{ justifyContent: "start" }}>
                    Recompensa
                  </Col>
                  <Col sm={4}>Custo da recompensa</Col>
                  <Col sm={8}>Itens</Col>
                </Header>
                {rewards?.campaignReward.map((item, index) => (
                  <CardReward key={item.id} invalid={isAnyCardDisabled}>
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
                                onClick={() =>
                                  rewardCounts[index] > 0 &&
                                  updateCounter(index, rewardCounts[index] - 1)
                                }
                              />
                              <p>{rewardCounts[index]}</p>
                              <PlusIconContainer
                                onClick={() => {
                                  const newCounts = [...rewardCounts];
                                  newCounts[index] += 1;
                                  const totalPointsNeeded =
                                    rewards?.campaignReward.reduce(
                                      (acc, reward, idx) =>
                                        acc +
                                        reward.points_reward * newCounts[idx],
                                      0
                                    );
                                  if (
                                    totalPointsNeeded <=
                                    rewards?.points_customer
                                  )
                                    setRewardCounts(newCounts);
                                }}
                                disabled={isAnyCardDisabled}
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
              </RewardContent>
            )}
          </Container>
        </GlobalContainer>
      )}
    </Modal>
  );
};

export default RewardModal;
