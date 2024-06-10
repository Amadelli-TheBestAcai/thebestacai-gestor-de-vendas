import React, { useState, useEffect } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { currencyFormater } from "../../helpers/currencyFormater";
import { v4 } from "uuid";
import moment from "moment";

import Payments from "../../containers/Payments";
import DisconectedForm from "../../containers/DisconectedForm";
import OrderProgressList from "../../containers/OrderProgressList";
import { useSale } from "../../hooks/useSale";
import Spinner from "../../components/Spinner";
import CashNotFound from "../../components/CashNotFound";

import { SaleDto } from "../../models/dtos/sale";
import { SalesTypes } from "../../models/enums/salesTypes";
import { PaymentType } from "../../models/enums/paymentType";
import { IntegrateAppSalesDTO } from "../../models/dtos/integrateAppSales";

import { Modal, notification } from "antd";

import {
  Container,
  PageContent,
  Header,
  TabPane,
  Tabs,
  LabelCardTab,
  TabPaneContainer,
  Content,
  AiqfomeIcon,
  AppIcon,
  IfoodIcon,
  TelephoneIcon,
  WhatsappIcon,
  RightContainer,
  LeftContainer,
  ActionContent,
  Input,
  Select,
  Option,
  InputValue,
  PaymentsContainer,
  ButtonsContainer,
  ButtonConfirm,
  ButtonCancel,
  OrdersListContainer,
  HeaderRight,
} from "./styles";

type ComponentProps = RouteComponentProps;

const Delivery: React.FC<ComponentProps> = () => {
  const { storeCash } = useSale();
  const [sale, setSale] = useState<SaleDto | null>(null);
  const [deliveries, setDeliveries] = useState<SaleDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasConnection, setHasConnection] = useState<boolean>(false);
  const [appSalesResult, setAppSalesResult] =
    useState<IntegrateAppSalesDTO | null>(null);
  const [paymentType, setPaymentType] = useState<number>(0);
  const [deliveryType, setDeliveryType] = useState<number>(5);
  const [amount, setAmount] = useState<number>(0);
  const [paymentModalTitle, setPaymentModalTitle] = useState("");
  const [paymentModal, setPaymentModal] = useState(false);
  const [flagCard, setFlagCard] = useState<number | null>(99);

  useEffect(() => {
    async function init() {
      const inConnected = await window.Main.hasInternet();

      const { response: _newSale, has_internal_error: errorOnBuildNewSale } =
        await window.Main.sale.buildNewSale();
      if (errorOnBuildNewSale) {
        return notification.error({
          message: "Erro ao criar uma venda",
          duration: 5,
        });
      }

      const { response: _deliveries, has_internal_error: errorOnAllDelivery } =
        await window.Main.sale.getAllDelivery();
      if (errorOnAllDelivery) {
        return notification.error({
          message: "Erro ao obter todos delivery",
          duration: 5,
        });
      }

      setSale(_newSale);
      setDeliveries(_deliveries);
      setHasConnection(inConnected);
      setLoading(false);
    }
    init();
  }, []);

  const addPayment = async () => {
    if (!amount) {
      //TODO: ADICIONAR VALIDAÇÃO
      return notification.warning({
        message: "Valor inválido!",
        description: `Informe um valor para o delivery.`,
        duration: 5,
      });
    }

    if ((paymentType === 1 || paymentType === 2) && !flagCard) {
      return notification.warning({
        message: "A bandeira do cartão é obrigatória",
        description: `Selecione uma opção para continuar com o pagamento`,
        duration: 5,
      });
    }

    if (flagCard) {
      const newPayment = {
        id: v4(),
        amount,
        type: paymentType,
        flag_card: flagCard,
        created_at: moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
      };

      const updatedSale = sale;
      updatedSale?.payments?.push(newPayment);

      setSale(updatedSale);

      setAmount(0);
      setFlagCard(99);
      setPaymentModal(false);
    } else {
      const newPayment = {
        id: v4(),
        amount,
        type: paymentType,
        created_at: moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
      };

      const updatedSale = sale;
      updatedSale?.payments?.push(newPayment);

      setSale(updatedSale);

      setAmount(0);
      setFlagCard(99);
      setPaymentModal(false);
    }
  };

  const removePayment = async (id: string) => {
    const payments = sale.payments.filter((_payment) => _payment.id !== id);
    setSale((oldValues) => ({
      ...oldValues,
      payments,
    }));
    setPaymentModal(false);
  };

  const handleOpenPayment = (
    type: number,
    title: string,
    flagCard = 99
  ): void => {
    setPaymentType(type);
    setFlagCard(flagCard);
    setPaymentModal(true);
    setPaymentModalTitle(title);
  };

  const handleCreateSale = async () => {
    if (!sale.payments.length) {
      notification.warning({
        message: "Oops! Nenhum valor informado",
        description: `Selecione o tipo de pagamento com o valor da venda.`,
        duration: 5,
      });
      return;
    }

    if (!sale.name) {
      notification.warning({
        message: "Nome não informado",
        description: "Informe o nome do cliente referente à venda atual.",
        duration: 5,
      });
      return;
    }

    Modal.confirm({
      content: "Tem certeza que gostaria de prosseguir?",
      okText: "Sim",
      okType: "default",
      cancelText: "Não",
      centered: true,
      okButtonProps: {
        loading: loading,
      },
      async onOk() {
        setLoading(true);
        const payload = sale;
        payload.quantity = 1;
        payload.type = deliveryType;
        const total = payload.payments.reduce(
          (total, payment) => total + +payment.amount,
          0
        );
        payload.total_sold = total;
        payload.total_paid = total;
        const { has_internal_error: errorOnCreateDelivery } =
          await window.Main.sale.createDelivery(payload);
        if (errorOnCreateDelivery) {
          return notification.error({
            message: "Erro ao criar delivery",
            duration: 5,
          });
        }

        const { response: newSale, has_internal_error: errorOnBuildNewSale } =
          await window.Main.sale.buildNewSale();
        if (errorOnBuildNewSale) {
          notification.error({
            message: "Erro ao criar uma venda",
            duration: 5,
          });
          return;
        }
        setSale(newSale);

        const {
          response: _newDeliveries,
          has_internal_error: errorOnAllDelivery,
        } = await window.Main.sale.getAllDelivery();
        if (errorOnAllDelivery) {
          return notification.error({
            message: "Erro ao obter todos delivery",
            duration: 5,
          });
        }
        setDeliveries(_newDeliveries);

        notification.success({
          message: "Venda salva com sucesso!",
          description: `A venda de [${payload.name}] foi salva com sucesso. 
                        Não esqueça de confirmar a venda em andamento, após ser finalizada.`,
          duration: 5,
        });
        setLoading(false);
      },
    });
  };

  const finishSale = async (id: string): Promise<void> => {
    Modal.confirm({
      content: "Gostaria de prosseguir e finalizar esta venda?",
      okText: "Sim",
      okType: "default",
      cancelText: "Não",
      centered: true,

      async onOk() {
        const payload = deliveries.find((_delivery) => _delivery.id === id);

        const { has_internal_error: errorOnFinishSAle, error_message } =
          await window.Main.sale.finishSale(
            { ...payload, formated_type: SalesTypes[payload.type] },
            true
          );
        if (errorOnFinishSAle) {
          error_message ? notification.warning({
            message: error_message,
            duration: 5,
          }) : notification.error({
            message: "Erro ao finalizar venda",
            duration: 5,
          });
        }

        const {
          response: _newDeliveries,
          has_internal_error: errorOnAllDelivery,
        } = await window.Main.sale.getAllDelivery();
        if (errorOnAllDelivery) {
          return notification.error({
            message: "Erro ao obter  delivery",
            duration: 5,
          });
        }
        setDeliveries(_newDeliveries);

        notification.success({
          message: "Venda confirmada!",
          description: `A venda selecionada foi finalizada, e não será mais exibida na lista de delivery em andamento.`,
          duration: 5,
        });
      },
    });
  };

  const handleCancelSale = async (id: string): Promise<void> => {
    Modal.confirm({
      content: "Gostaria de prosseguir e cancelar esta venda?",
      okText: "Sim",
      okType: "default",
      cancelText: "Não",
      centered: true,

      async onOk() {
        const { has_internal_error: errorOnDeleteDelivery } =
          await window.Main.sale.deleteSaleDelivery(id);
        if (errorOnDeleteDelivery) {
          return notification.error({
            message: "Erro ao remover delivery",
            duration: 5,
          });
        }

        const {
          response: _deliveries,
          has_internal_error: errorOnAllDelivery,
        } = await window.Main.sale.getAllDelivery();
        if (errorOnAllDelivery) {
          return notification.error({
            message: "Erro ao obter todos delivery",
            duration: 5,
          });
        }

        setDeliveries(_deliveries);

        notification.success({
          message: "Venda removida com sucesso!",
          description: `A venda selecionada foi removida, e não será mais exibida na lista de delivery em andamento.`,
          duration: 5,
        });
      },
    });
  };

  const handleCancel = () => {
    const payments = sale.payments;
    while (payments.length) {
      payments.pop();
    }
    setSale((oldValues) => ({
      ...oldValues,
      payments,
      name: "",
    }));
  };

  const integrateAllSalesFromType = async (type: number) => {
    Modal.confirm({
      content: "Tem certeza que gostaria de prosseguir?",
      okText: "Sim",
      okType: "default",
      cancelText: "Não",
      centered: true,
      async onOk() {
        const { has_internal_error: errorOnIntegrateAllSales, error_message } =
          await window.Main.sale.integrateAllSalesFromType(type);
        if (errorOnIntegrateAllSales) {
          error_message ? notification.warning({
            message: error_message,
            duration: 5,
          }) : notification.error({
            message: error_message || "Erro ao integrar todos os delivery",
            duration: 5,
          });
        }

        const {
          response: _updatedDeliverySales,
          has_internal_error: errorOnAllDelivery,
        } = await window.Main.sale.getAllDelivery();
        if (errorOnAllDelivery) {
          return notification.error({
            message: "Erro ao obter todos delivery",
            duration: 5,
          });
        }
        setDeliveries(_updatedDeliverySales);

        if (sale.is_online === false) {
          notification.success({
            message: "Venda salva com sucesso!",
            description: `Sua venda foi salva com sucesso, porém você precisa abrir um caixa online, para integrá-la`,
            duration: 5,
          });
        } else {
          notification.success({
            message: "Vendas integradas com sucesso!",
            description: `A venda do tipo [${SalesTypes[deliveryType]}] foram integradas com sucesso. 
                          Não esqueça que após a integração das vendas, pode levar uns minutos até serem processadas pelo servidor.`,
            duration: 5,
          });
        }

      },
    });
  };

  const keyMap = {
    money: "a",
    MONEY: "A",
    c_credit: "s",
    C_CREDIT: "S",
    c_debit: "d",
    C_DEBIT: "D",
    online: "o",
    ONLINE: "O",
    pix: "p",
    PIX: "P",
    adicionar: "f",
    ADICIONAR: "F",
    aplicativo: "f2",
    ifood: "f3",
    outros: "f4",
    whatsapp: "f5",
    telefone: "f6",
  };

  const handlers = {
    money: () => handleOpenPayment(PaymentType.DINHEIRO, "Dinheiro"),
    MONEY: () => handleOpenPayment(PaymentType.DINHEIRO, "Dinheiro"),
    c_credit: () =>
      handleOpenPayment(PaymentType.CREDITO, "C. Crédito", flagCard),
    C_CREDIT: () =>
      handleOpenPayment(PaymentType.CREDITO, "C. Crédito", flagCard),
    c_debit: () => handleOpenPayment(PaymentType.DEBITO, "C. Débito", flagCard),
    C_DEBIT: () => handleOpenPayment(PaymentType.DEBITO, "C. Débito", flagCard),
    online: () => handleOpenPayment(PaymentType.ONLINE, "Online"),
    ONLINE: () => handleOpenPayment(PaymentType.ONLINE, "Online"),
    pix: () => handleOpenPayment(PaymentType.PIX, "PIX"),
    PIX: () => handleOpenPayment(PaymentType.PIX, "PIX"),
    adicionar: () => handleCreateSale(),
    ADICIONAR: () => handleCreateSale(),
    aplicativo: () => setDeliveryType(5),
    ifood: () => setDeliveryType(1),
    outros: () => setDeliveryType(6),
    whatsapp: () => setDeliveryType(3),
    telefone: () => setDeliveryType(4),
  };

  const tabPanes = [
    {
      id: 5,
      label: (
        <TabPaneContainer isSelected={deliveryType === 5}>
          <label>[F2]</label>
          <LabelCardTab>
            <AppIcon />
            <span>Aplicativo</span>
          </LabelCardTab>
        </TabPaneContainer>
      ),
    },
    {
      id: 1,
      label: (
        <TabPaneContainer isSelected={deliveryType === 1}>
          <label>[F3]</label>
          <LabelCardTab>
            <IfoodIcon />
            <span>Ifood</span>
          </LabelCardTab>
        </TabPaneContainer>
      ),
    },
    {
      id: 6,
      label: (
        <TabPaneContainer isSelected={deliveryType === 6}>
          <label>[F4]</label>
          <LabelCardTab>
            <AiqfomeIcon />
            <span>Outros</span>
          </LabelCardTab>
        </TabPaneContainer>
      ),
    },
    {
      id: 3,
      label: (
        <TabPaneContainer isSelected={deliveryType === 3}>
          <label>[F5]</label>
          <LabelCardTab>
            <WhatsappIcon />
            <span>Whatsapp</span>
          </LabelCardTab>
        </TabPaneContainer>
      ),
    },
    {
      id: 4,
      label: (
        <TabPaneContainer isSelected={deliveryType === 4}>
          <label>[F6]</label>
          <LabelCardTab>
            <TelephoneIcon />
            <span>Telefone</span>
          </LabelCardTab>
        </TabPaneContainer>
      ),
    },
  ];

  return (
    <Container id="mainContainer" handlers={handlers} keyMap={keyMap}>
      <PageContent>
        {loading ? (
          <>
            <Spinner />
          </>
        ) : (
          <>
            {hasConnection ? (
              <>
                {storeCash?.is_opened ? (
                  <>
                    <Header>
                      <h2>Delivery</h2>
                    </Header>
                    <Tabs
                      centered
                      onChange={(type) => setDeliveryType(+type)}
                    >
                      {tabPanes.map((_tab) => (
                        <TabPane key={_tab.id} tab={_tab.label}>
                          <Content>
                            <LeftContainer>
                              <h2>Adicionar Pedidos</h2>
                              <ActionContent>
                                <Input
                                  placeholder="Nome do cliente"
                                  value={sale?.name}
                                  onChange={({ target: { value } }) =>
                                    setSale((oldValues) => ({
                                      ...oldValues,
                                      name: value,
                                    }))
                                  }
                                />
                                <Select placeholder="Escolha a opção">
                                  <Option>Entrega</Option>
                                </Select>
                              </ActionContent>
                              {sale.payments.length !== 0 && (
                                <InputValue>
                                  R${" "}
                                  {currencyFormater(
                                    sale?.payments?.reduce(
                                      (total, _payment) =>
                                        +_payment.amount + total,
                                      0
                                    )
                                  )}
                                  <span>Valor do Delivery</span>
                                </InputValue>
                              )}
                              <PaymentsContainer>
                                <Payments
                                  sale={sale}
                                  addPayment={addPayment}
                                  removePayment={removePayment}
                                  setCurrentPayment={setAmount}
                                  modalState={paymentModal}
                                  modalTitle={paymentModalTitle}
                                  setModalState={setPaymentModal}
                                  handleOpenPayment={handleOpenPayment}
                                  usingDelivery={true}
                                  flagCard={flagCard}
                                  setFlagCard={setFlagCard}
                                />
                              </PaymentsContainer>

                              <ButtonsContainer>
                                <ButtonCancel onClick={() => handleCancel()}>
                                  CANCELAR [C]
                                </ButtonCancel>
                                <ButtonConfirm onClick={handleCreateSale}>
                                  ADICIONAR [F]
                                </ButtonConfirm>
                              </ButtonsContainer>
                            </LeftContainer>

                            <RightContainer>
                              <HeaderRight>
                                <h2>Delivery em Andamento</h2>

                                {deliveries.length !== 0 && (
                                  <a
                                    onClick={() =>
                                      integrateAllSalesFromType(deliveryType)
                                    }
                                  >
                                    {" "}
                                    Confirmar todas as vendas
                                  </a>
                                )}
                              </HeaderRight>

                              <OrdersListContainer>
                                <OrderProgressList
                                  finishSale={finishSale}
                                  removeSale={handleCancelSale}
                                  deliveries={deliveries?.filter(
                                    (_delivery) =>
                                      _delivery.type === deliveryType
                                  )}
                                />
                              </OrdersListContainer>
                            </RightContainer>
                          </Content>
                        </TabPane>
                      ))}
                    </Tabs>
                  </>
                ) : (
                  <CashNotFound description="Nenhum caixa aberto no momento. Abra o caixa para iniciar as vendas."/>
                )}
              </>
            ) : (
              <>
                <DisconectedForm />
              </>
            )}
          </>
        )}
      </PageContent>
    </Container>
  );
};

export default withRouter(Delivery);
