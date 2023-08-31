import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Empty, notification } from "antd";
import {
  Modal,
  Container,
  GlobalContainer,
  ButtonSearch,
  InputSearchReward,
  RewardSearch,
  ButtonCancel,
  Footer,
  ButtonSave,
  Col,
  Row,
  InfoClient,
  PointsCustomerContainer,
  DataClient,
  CustomerPoints,
  ContentReward,
  ProgressBarActived,
  ProgressBar,
  ContentGeneral,
  Value,
  TitleReward,
  ImgReward,
  InputMask
} from "./styles";
import { useStore } from "../../hooks/useStore";
import { CustomerReward, Reward } from "../../models/dtos/customerReward";
import Spinner from "../../components/Spinner";
import { useUser } from "../../hooks/useUser";
import { useSale } from "../../hooks/useSale";
import { EmptyContainer } from "../Items/styles";

interface IProps {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}

const RewardModal: React.FC<IProps> = ({ isVisible, setIsVisible }) => {
  const [loading, setLoading] = useState(false);
  const [shouldSearch, setShouldSearch] = useState(false);
  const [userHash, setUserHash] = useState("");
  const [customerReward, setCustomerReward] = useState<CustomerReward>();
  const [rewards, setRewards] = useState<Reward>();
  const [phone, setPhone] = useState("");

  const { store } = useStore();
  const { user } = useUser();
  const { storeCash } = useSale();

  const getCampaignReward = async () => {
    try {
      if (userHash.length !== 8) {
        return notification.error({
          message: `O hashcode deve conter 8 dígitos`,
          duration: 5,
        });
      }

      if (userHash === "" || phone === "") {
        return notification.warning({
          message: "Preencha todos os campos",
          duration: 5,
        });
      }

      setLoading(true);
      const { has_internal_error, error_message, response } =
        await window.Main.sale.getCustomerReward(phone, userHash.toUpperCase());

      if (has_internal_error) {
        setLoading(false);
        return notification.error({
          message: error_message || "Erro ao buscar recompensas",
          duration: 5,
        });
      }

      const { name, customer_reward, points_customer, max_points, total_accumulated_points } = response;

      setCustomerReward({
        customer_name: name,
        points_customer,
        max_points,
        total_accumulated_points,
        ...customer_reward,
      });

      setRewards(customer_reward.campaignReward);
      setUserHash(userHash);
      setPhone(phone);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      notification.error({
        //@ts-ignore
        message: error.message || "Erro ao buscar recompensas",
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shouldSearch && userHash && phone) {
      getCampaignReward();
    }
  }, [shouldSearch]);

  const resetModalState = () => {
    setLoading(false);
    setShouldSearch(false);
    setUserHash("");
    setPhone("");
    setRewards(null);
    setIsVisible(false);
    setCustomerReward(null);
  };

  const useReward = async () => {
    setLoading(true);
    try {
      const payload = {
        store_id: store.company_id,
        user_name: user.name,
        user_id: user.id,
        company_name: store.company.company_name,
      };
  
      const {
        has_internal_error: createCustomerError,
        error_message: error_message_create_customer_reward,
      } = await window.Main.sale.redeemReward(customerReward.id, payload);
  
      if (createCustomerError) {
        notification.error({
          message: error_message_create_customer_reward,
          duration: 5,
        });
        setLoading(false); 
        return; 
      }
  
      const { has_internal_error: rewardError, error_message } =
        await window.Main.sale.integrateRewardWithSale(rewards.product_id);
  
      if (rewardError) {
        notification.warning({
          message: error_message,
          duration: 5,
        });
      }
  
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
  
  return (
    <Modal
      title="Recompensas"
      centered
      visible={isVisible}
      onCancel={resetModalState}
      width={"60%"}
      destroyOnClose
      footer={
        <>
          {customerReward && (
            <Footer>
              {storeCash?.is_opened && storeCash.is_online && (
                <>
                  <ButtonCancel onClick={resetModalState}>Cancelar</ButtonCancel>
                  <ButtonSave onClick={useReward} disabled={loading}>
                    Resgatar recompensa
                  </ButtonSave>
                </>
              )}
            </Footer>
          )}
        </>
      }
    >
      {storeCash?.is_opened && storeCash.is_online ? (
        loading ? (
          <Spinner />
        ) : (
          <GlobalContainer>
            <RewardSearch>
              <Row gutter={12}>
                <Col md={10}>
                  <InputMask
                    placeholder="Digite o telefone"
                    mask="(00) 00000-0000"
                    value={phone}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const inputValue = event.target.value;
                      const numericValue = inputValue.replace(/\D/g, '');
                      setPhone(numericValue);
                    }}
                  />
                </Col>
                <Col md={10}>
                  <InputSearchReward
                    placeholder="Digite o hashcode"
                    type="text"
                    maxLength={8}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const userInput = event.target.value.slice(0, 8).toUpperCase();
                      setUserHash(userInput);
                    }}
                    value={userHash}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        getCampaignReward();
                      }
                    }}
                  />
                </Col>
                <Col md={4}>
                  <ButtonSearch onClick={getCampaignReward} disabled={loading || !phone || !userHash}>
                    {loading ? "..." : "Buscar"}
                  </ButtonSearch>
                </Col>
              </Row>
            </RewardSearch>

            {customerReward &&
              (
                <Container>
                  <InfoClient><p>{customerReward.customer_name}</p></InfoClient>
                  <PointsCustomerContainer>
                    <DataClient>
                      <ContentGeneral>
                        <Value>
                          <div>
                            <span>Pontos disponíveis</span>
                            <CustomerPoints available>{customerReward.points_customer}<span>pts</span></CustomerPoints>
                          </div>
                          {/* <div>
                            <span>Total de pontos acumulados da campanha</span>
                            <CustomerPoints available={false}>{customerReward.total_accumulated_points}<span>pts</span></CustomerPoints>
                          </div> */}
                        </Value>

                        <ProgressBar>
                          <ProgressBarActived actived={`${customerReward?.points_customer
                            ? customerReward?.points_customer
                            : 0
                            }%`} />
                        </ProgressBar>

                        <span className="max-points">Máx. {customerReward.max_points} pts</span>
                      </ContentGeneral>
                    </DataClient>
                  </PointsCustomerContainer>

                  <ContentReward>
                    {rewards ? (
                      <>
                        <Container>
                          <ContentReward>
                            <TitleReward>{rewards.description}</TitleReward>

                            <ImgReward src={rewards.url_image} />
                          </ContentReward>
                        </Container>
                      </>
                    ) : (
                      <p>Não há recompensa disponível</p>
                    )}
                  </ContentReward>
                </Container>
              )
            }
          </GlobalContainer>
        )
      ) : (
        <EmptyContainer>
          <Empty description="O caixa deve estar online" />
        </EmptyContainer>
      )}
    </Modal >
  );
};

export default RewardModal;
