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
  const [hasInternet, setHasInternet] = useState(false);
  const [userHash, setUserHash] = useState("");
  const [customerReward, setCustomerReward] = useState<CustomerReward>();
  const [rewards, setRewards] = useState<Reward>();

  const { sale, storeCash, setSale } = useSale();

  const getCampaignReward = async () => {
    try {
      const isConnected = await window.Main.hasInternet();

      if (!isConnected) {
        return notification.error({
          message: `Você está sem conexão com a internet`,
          duration: 5,
        });
      }

      if (userHash.length !== 8) {
        return notification.error({
          message: `O hashcode deve conter 8 dígitos`,
          duration: 5,
        });
      }

      if (userHash === "") {
        return notification.warning({
          message: "Preencha todos os campos",
          duration: 5,
        });
      }

      setLoading(true);
      const { has_internal_error, error_message, response } =
        await window.Main.sale.getCustomerReward(userHash.toUpperCase());

      if (has_internal_error) {
        setLoading(false);
        return notification.error({
          message: error_message || "Erro ao buscar recompensas",
          duration: 5,
        });
      }

      const {
        name,
        customer_reward,
        points_customer,
        max_points,
        total_accumulated_points,
      } = response;

      setCustomerReward({
        customer_name: name,
        points_customer,
        max_points,
        total_accumulated_points,
        ...customer_reward,
      });

      setRewards(customer_reward.campaignReward);
      setUserHash(userHash);
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
    const internetVerify = async () => {
      const isConnected = await window.Main.hasInternet();
      setHasInternet(isConnected);
    };
    if (isVisible) {
      internetVerify();
    }
  }, [isVisible]);

  useEffect(() => {
    if (shouldSearch && userHash) {
      getCampaignReward();
    }
  }, [shouldSearch]);

  const resetModalState = () => {
    setLoading(false);
    setShouldSearch(false);
    setUserHash("");
    setRewards(null);
    setIsVisible(false);
    setCustomerReward(null);
  };

  const cancelReward = async () => {
    setLoading(true);
    try {
      const payload = {
        ...sale,
        customer_reward_id: null,
        items: sale.items.filter((item) => !item.customer_reward_id),
      };
      const { response: _updatedSale } = await window.Main.sale.updateSale(
        sale.id,
        payload
      );

      setSale(_updatedSale);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const useReward = async () => {
    setLoading(true);
    try {
      const { response: products } = await window.Main.product.getProducts(
        true
      );
      let product = products.find(
        (_product) => _product.product_id === rewards.product_id
      );
      if (!product) {
        notification.error({
          message:
            "O produto da recompensa não esta cadastrado em sua loja. Realize o cadastro pelo Dashboard",
          duration: 5,
        });
        setLoading(false);
        return;
      }

      product.price_unit = "0";

      const {
        response: updatedSaleWithReward,
        has_internal_error: errorOnAddItem,
        error_message,
      } = await window.Main.sale.addItem(
        { ...product, customer_reward_id: customerReward.id },
        1,
        rewards.additional_value ? +rewards.additional_value : 0
      );

      if (errorOnAddItem) {
        notification.error({
          message: "Falha ao resgatar o produto",
          duration: 5,
        });
        console.log(error_message);
        return;
      }

      const { response: _updatedSale } = await window.Main.sale.updateSale(
        sale.id,
        {
          ...updatedSaleWithReward,
          customer_reward_id: customerReward.id,
        }
      );

      setSale(_updatedSale);

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
      document.getElementById("balanceInput").focus();
    }
  };

  return (
    <Modal
      title="Recompensas"
      centered
      visible={isVisible}
      onCancel={resetModalState}
      width={"40%"}
      destroyOnClose
      afterClose={() => document.getElementById("balanceInput").focus()}
      footer={
        <>
          {customerReward && (
            <Footer>
              {storeCash?.is_opened && storeCash.is_online && hasInternet && (
                <>
                  <ButtonCancel onClick={resetModalState}>
                    Cancelar
                  </ButtonCancel>
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
        hasInternet ? (
          loading ? (
            <Spinner />
          ) : (
            <GlobalContainer>
              {sale.customer_reward_id ? (
                <>
                  Recompensa pendente no carrinho, para resgatar outra, finalize
                  a venda atual ou então cancele a utilização da recompensa
                  clicando no botão abaixo *Ao cancelar a utilização da
                  recompensa, a mesma continuará disponível para retirar
                  futuramente.
                  <ButtonSave
                    style={{ margin: "auto" }}
                    onClick={cancelReward}
                    disabled={loading}
                  >
                    Cancelar recompensa
                  </ButtonSave>
                </>
              ) : (
                <>
                  <RewardSearch>
                    <Row>
                      <Col md={10}>
                        <InputSearchReward
                          placeholder="Digite o hashcode"
                          type="text"
                          maxLength={8}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            const userInput = event.target.value
                              .slice(0, 8)
                              .toUpperCase();
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
                        <ButtonSearch
                          onClick={getCampaignReward}
                          disabled={loading || !userHash}
                        >
                          {loading ? "..." : "Buscar"}
                        </ButtonSearch>
                      </Col>
                    </Row>
                  </RewardSearch>

                  {customerReward && (
                    <Container>
                      <InfoClient>
                        <p>{customerReward.customer_name}</p>
                      </InfoClient>
                      <PointsCustomerContainer>
                        <DataClient>
                          <ContentGeneral>
                            <Value>
                              <div>
                                <span>Pontos disponíveis</span>
                                <CustomerPoints available>
                                  {customerReward.points_customer}
                                  <span>pts</span>
                                </CustomerPoints>
                              </div>
                              {/* <div>
                            <span>Total de pontos acumulados da campanha</span>
                            <CustomerPoints available={false}>{customerReward.total_accumulated_points}<span>pts</span></CustomerPoints>
                          </div> */}
                            </Value>

                            <ProgressBar>
                              <ProgressBarActived
                                actived={`${
                                  customerReward?.points_customer
                                    ? customerReward?.points_customer
                                    : 0
                                }%`}
                              />
                            </ProgressBar>

                            <span className="max-points">
                              Máx. {customerReward.max_points} pts
                            </span>
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
                  )}
                </>
              )}
            </GlobalContainer>
          )
        ) : (
          <EmptyContainer>
            <Empty description="Você está sem conexão com a internet" />
          </EmptyContainer>
        )
      ) : (
        <EmptyContainer>
          <Empty description="O caixa deve estar online" />
        </EmptyContainer>
      )}
    </Modal>
  );
};

export default RewardModal;
