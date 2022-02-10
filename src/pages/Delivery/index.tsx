import React, { useState, useEffect } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { currencyFormater } from "../../helpers/currencyFormater";
import { v4 } from "uuid";
import moment from "moment";

import Payments from "../../containers/Payments";
import OrderProgressList from "../../containers/OrderProgressList";
import { useSale } from "../../hooks/useSale";
import Spinner from "../../components/Spinner";
import CashNotFound from "../../components/CashNotFound";

import { SaleDto } from "../../models/dtos/sale";
import { SalesTypes } from "../../models/enums/salesTypes";
import { PaymentType } from "../../models/enums/paymentType";
import { IntegrateAppSalesDTO } from "../../models/dtos/integrateAppSales";

import { Modal, notification, Tooltip } from "antd";

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
  CheckAll,
  HeaderRight,
} from "./styles";

type ComponentProps = RouteComponentProps;

const Delivery: React.FC<ComponentProps> = ({ history }) => {
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

  useEffect(() => {
    async function init() {
      const _newSale = await window.Main.sale.buildNewSale();
      setSale(_newSale);
      const _deliveries = await window.Main.sale.getAllDelivery();
      setDeliveries(_deliveries);
      setLoading(false);
    }
    init();
  }, []);

  useEffect(() => {
    async function init() {
      const _sale = await window.Main.sale.getSaleFromApp();
      const inConnected = await window.Main.hasInternet();
      setHasConnection(inConnected);
      const salesResult: IntegrateAppSalesDTO = {
        sales_in_delivery: _sale.length,
        total: _sale.reduce((total, sale) => total + +sale.valor_pedido, 0),
        money: _sale
          .filter((sale) => +sale.tipo_pagamento === PaymentType.DINHEIRO)
          .reduce((total, sale) => total + +sale.valor_pedido, 0),
        credit_card: _sale
          .filter((sale) => +sale.tipo_pagamento === PaymentType.CREDITO)
          .reduce((total, sale) => total + +sale.valor_pedido, 0),
        debit_card: _sale
          .filter((sale) => +sale.tipo_pagamento === PaymentType.DEBITO)
          .reduce((total, sale) => total + +sale.valor_pedido, 0),
        salesIds: _sale.map((sale) => sale.id),
      };
      setAppSalesResult(salesResult);
      setLoading(false);
    }
    init();
  }, []);

  const addPayment = async () => {
    if (!amount) {
      //TODO: ADICIONAR VALIDAÇÃO
      return;
    }

    const newPayment = {
      id: v4(),
      amount,
      type: paymentType,
      created_at: moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
    };

    const updatedSale = sale;
    updatedSale.payments.push(newPayment);

    setSale(updatedSale);

    setAmount(0);
    setPaymentModal(false);
  };

  const removePayment = async (id: string) => {
    const payments = sale.payments.filter((_payment) => _payment.id !== id);
    setSale((oldValues) => ({
      ...oldValues,
      payments,
    }));
    setPaymentModal(false);
  };

  const handleOpenPayment = (type: number, title: string): void => {
    setPaymentType(type);
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
      async onOk() {
        const payload = sale;
        payload.quantity = 1;
        payload.type = deliveryType;
        await window.Main.sale.createDelivery(payload);
        const newSale = await window.Main.sale.buildNewSale(false);
        setSale(newSale);
        const _newDeliveries = await window.Main.sale.getAllDelivery();
        setDeliveries(_newDeliveries);
        notification.success({
          message: "Venda salva com sucesso!",
          description: `A venda de [${payload.name}] foi salva com sucesso. 
                        Não esqueça de confirmar a venda em andamento, após ser finalizada.`,
          duration: 5,
        });
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
        await window.Main.sale.finishSale(payload, true);
        const _newDeliveries = await window.Main.sale.getAllDelivery();
        setDeliveries(_newDeliveries);
        notification.success({
          message: "Venda confirmada!",
          description: `A venda selecionada foi finalizada, e não será mais exibida na lista de delivery em andamento.`,
          duration: 5,
        });
      },
    });
  };

  const formatAppSaleToSales = () => {
    const listOfSales = [].map((appSale) => ({
      change_amount: 0,
      type: 5,
      discount: 0,
      cash_id: +storeCash?.cash_id,
      cash_history_id: storeCash?.history_id,
      quantity: 1,
      items: [],
      payments: [
        { amount: +appSale.valor_pedido, type: +appSale.tipo_pagamento },
      ],
    }));
    const listOfIds = [].map((sale) => sale.id);
    return {
      sales: listOfSales,
      appSalesIds: listOfIds,
    };
  };

  // const handleUpdateProduct = async () => {
  //   confirm({
  //     title: "Integrar Vendas",
  //     content:
  //       "Gostaria de prosseguir com a integração das vendas ao caixa atual??",
  //     okText: "Sim",
  //     okType: "default",
  //     cancelText: "Não",
  //     async onOk() {
  //       const payload = formatAppSaleToSales();
  //       setLoadingSales(true);
  //       ipcRenderer.send("appSale:integrate", payload);
  //       ipcRenderer.once("appSale:integrate:response", (event, status) => {
  //         if (status) {
  //           message.success("Vendas integradas com sucesso.");
  //           history.push("/home");
  //         } else {
  //           message.error("Erro ao integrar vendas");
  //         }
  //         setLoadingSales(false);
  //       });
  //     },
  //   });
  // };

  const integrateAllSalesFromType = async (type: number) => {
    Modal.confirm({
      content: "Tem certeza que gostaria de prosseguir?",
      okText: "Sim",
      okType: "default",
      cancelText: "Não",
      centered: true,
      async onOk() {
        await window.Main.sale.integrateAllSalesFromType(type);
        const _updatedDeliverySales = await window.Main.sale.getAllDelivery();
        setDeliveries(_updatedDeliverySales);
        notification.success({
          message: "Vendas integradas com sucesso!",
          description: `A venda do tipo [${SalesTypes[deliveryType]}] foram integradas com sucesso. 
                        Não esqueça que após a integração das vendas, pode levar uns minutos até serem processadas pelo servidor.`,
          duration: 5,
        });
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
    ticket: "t",
    TICKET: "T",
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
    c_credit: () => handleOpenPayment(PaymentType.CREDITO, "Crédito"),
    C_CREDIT: () => handleOpenPayment(PaymentType.CREDITO, "Crédito"),
    c_debit: () => handleOpenPayment(PaymentType.DEBITO, "Débito"),
    C_DEBIT: () => handleOpenPayment(PaymentType.DEBITO, "Débito"),
    ticket: () => handleOpenPayment(PaymentType.TICKET, "Ticket"),
    TICKET: () => handleOpenPayment(PaymentType.TICKET, "Ticket"),
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
        {storeCash?.is_opened ? (
          <>
            <Header>
              <h2>Delivery</h2>
            </Header>
            {loading ? (
              <Spinner />
            ) : (
              <Tabs
                defaultActiveKey="1"
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
                            value={sale.name}
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
                        <InputValue>
                          R${" "}
                          {currencyFormater(
                            sale.payments.reduce(
                              (total, _payment) => +_payment.amount + total,
                              0
                            )
                          )}
                          <span>Valor do Delivery</span>
                        </InputValue>
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
                          />
                        </PaymentsContainer>

                        <ButtonsContainer>
                          <ButtonCancel>CANCELAR [C]</ButtonCancel>
                          <ButtonConfirm onClick={handleCreateSale}>
                            ADICIONAR [F]
                          </ButtonConfirm>
                        </ButtonsContainer>
                      </LeftContainer>

                      <RightContainer>
                        <HeaderRight>
                          <h2>Delivery em Andamento</h2>
                          <Tooltip
                            placement="right"
                            title="Confirmar todas as vendas"
                          >
                            <CheckAll
                              onClick={() =>
                                integrateAllSalesFromType(deliveryType)
                              }
                            />
                          </Tooltip>
                        </HeaderRight>

                        <OrdersListContainer>
                          <OrderProgressList
                            finishSale={finishSale}
                            deliveries={deliveries.filter(
                              (_delivery) => _delivery.type === deliveryType
                            )}
                          />
                        </OrdersListContainer>
                      </RightContainer>
                    </Content>
                  </TabPane>
                ))}
              </Tabs>
            )}
          </>
        ) : (
          <CashNotFound />
        )}
      </PageContent>
    </Container>
  );
};

export default withRouter(Delivery);
