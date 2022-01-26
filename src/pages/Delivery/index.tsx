import React, { useState, useEffect } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
// import { ipcRenderer } from "electron";

import { AppSale as AppSaleModel } from "../../models/appSales";
import { IntegrateAppSalesDTO } from "../../models/dtos/integrateAppSales";
import { PaymentType } from "../../models/enums/paymentType";
import Payments from "../../containers/Payments";

import { Sale } from "../../models/sale";

import { StoreCashDto } from "../../models/dtos/storeCash";
import { useSale } from "../../hooks/useSale";

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
} from "./styles";

type ComponentProps = RouteComponentProps;

const Delivery: React.FC<ComponentProps> = ({ history }) => {
  const { sale, setSale } = useSale();
  //const [sale, setSale] = useState<Sale | null>(null);
  const [cashier, setCashier] = useState<StoreCashDto>();
  const [sales, setSales] = useState<AppSaleModel[]>([]);
  const [hasConnection, setHasConnection] = useState<boolean>(false);
  const [appSalesResult, setAppSalesResult] =
    useState<IntegrateAppSalesDTO | null>(null);
  const [loadingSales, setLoadingSales] = useState(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [paymentType, setPaymentType] = useState<number>(0);
  const [amount, setAmount] = useState<number>();
  const [paymentModalTitle, setPaymentModalTitle] = useState("");
  const [currentPayment, setCurrentPayment] = useState(0);
  const [paymentModal, setPaymentModal] = useState(false);

  useEffect(() => {
    async function init() {
      const _storeCash = await window.Main.storeCash.getCurrent();
      setCashier(_storeCash);
      // setSale((oldValues) => ({
      //   ...oldValues,
      //   store_id: _storeCash?.store_id,
      //   cash_id: _storeCash?.cash_id,
      //   cash_code: _storeCash?.code,
      //   cash_history_id: _storeCash?.history_id,
      //   change_amount: 0,
      //   type: "APP",
      //   discount: 0,
      //   to_integrate: true,
      //   is_current: false,
      // }));
      setLoading(false);
    }
    init();
  }, []);

  useEffect(() => {
    async function init() {
      setLoadingSales(true);
      const _sale = await window.Main.sale.getSaleFromApp();
      const inConnected = await window.Main.hasInternet();
      console.log(_sale);
      setHasConnection(inConnected);
      setSales(_sale);
      setLoadingSales(false);
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
    }
    init();
  }, []);

  const handlePlatform = (value: string) => {
    //setSale((oldValues) => ({ ...oldValues, type: value }));
  };

  const addPayment = async () => {
    if (!currentPayment) {
    }

    const updatedSale = await window.Main.sale.addPayment(
      currentPayment,
      paymentType
    );
    //setSale(updatedSale);

    setCurrentPayment(0);
    setPaymentModal(false);
  };

  const removePayment = async (id: string) => {
    const updatedSale = await window.Main.sale.deletePayment(id);
    //setSale(updatedSale);
  };

  const handleOpenPayment = (type: number, title: string): void => {
    setPaymentType(type);
    setPaymentModal(true);
    setPaymentModalTitle(title);
  };

  // const handleCreateSale = async () => {
  //   if (isLoading) {
  //     return;
  //   }
  //   if (!amount) {
  //     return;
  //   }
  //   confirm({
  //     content: "Tem certeza que gostaria de prosseguir?",
  //     okText: "Sim",
  //     okType: "default",
  //     cancelText: "Não",
  //     onOk() {
  //       setLoading(true);
  //       ipcRenderer.send("sale:addDelivery", {
  //         sale: {
  //           ...sale,
  //           quantity: 1,
  //           total: amount,
  //         },
  //         payment: {
  //           type: paymentType,
  //           amount,
  //         },
  //       });
  //       ipcRenderer.once("sale:addDelivery:response", (event, status) => {
  //         setAmount(0);
  //         if (status) {
  //           message.success("Venda salva com sucesso");
  //           setSale((oldValues) => ({
  //             ...oldValues,
  //             store_id: cashier?.store_id,
  //             cash_id: cashier?.cash_id,
  //             cash_code: cashier?.code,
  //             cash_history_id: cashier?.history_id,
  //             change_amount: 0,
  //             type: "APP",
  //             discount: 0,
  //             to_integrate: true,
  //             is_current: false,
  //           }));
  //         } else {
  //           message.error("Falha ao salvar venda");
  //         }
  //         setLoading(false);
  //       });
  //     },
  //   });
  // };

  const formatAppSaleToSales = () => {
    const listOfSales = sales.map((appSale) => ({
      change_amount: 0,
      type: 5,
      discount: 0,
      cash_id: +cashier?.cash_id,
      cash_history_id: cashier?.history_id,
      quantity: 1,
      items: [],
      payments: [
        { amount: +appSale.valor_pedido, type: +appSale.tipo_pagamento },
      ],
    }));
    const listOfIds = sales.map((sale) => sale.id);
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

  const tabPanes = [
    {
      id: 1,
      label: (
        <TabPaneContainer>
          <label>[F2]</label>
          <LabelCardTab>
            <AppIcon />
            <span>Aplicativo</span>
          </LabelCardTab>
        </TabPaneContainer>
      ),
    },
    {
      id: 2,
      label: (
        <TabPaneContainer>
          <label>[F3]</label>
          <LabelCardTab>
            <IfoodIcon />
            <span>Ifood</span>
          </LabelCardTab>
        </TabPaneContainer>
      ),
    },
    {
      id: 3,
      label: (
        <TabPaneContainer>
          <label>[F4]</label>
          <LabelCardTab>
            <AiqfomeIcon />
            <span>Outros</span>
          </LabelCardTab>
        </TabPaneContainer>
      ),
    },
    {
      id: 4,
      label: (
        <TabPaneContainer>
          <label>[F5</label>
          <LabelCardTab>
            <WhatsappIcon />
            <span>Whatsapp</span>
          </LabelCardTab>
        </TabPaneContainer>
      ),
    },
    {
      id: 5,
      label: (
        <TabPaneContainer>
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
    <Container>
      <PageContent>
        <Header>
          <h2>Delivery</h2>
        </Header>
        <Tabs defaultActiveKey="1" centered>
          {tabPanes.map((_tab) => (
            <TabPane key={_tab.id} tab={_tab.label}>
              <Content>
                <LeftContainer>
                  <h2>Adicionar Pedidos</h2>
                  <ActionContent>
                    <Input placeholder="Nome do cliente" />
                    <Select placeholder="Escolha a opção">
                      <Option>Entrega</Option>
                    </Select>
                  </ActionContent>
                  <InputValue />
                  <PaymentsContainer>
                    <Payments
                      sale={sale}
                      addPayment={addPayment}
                      removePayment={removePayment}
                      setCurrentPayment={setCurrentPayment}
                      modalState={paymentModal}
                      modalTitle={paymentModalTitle}
                      setModalState={setPaymentModal}
                      handleOpenPayment={handleOpenPayment}
                    />
                  </PaymentsContainer>

                  <ButtonsContainer>
                    <ButtonCancel>CANCELAR [C]</ButtonCancel>
                    <ButtonConfirm>ADICIONAR [F]</ButtonConfirm>
                  </ButtonsContainer>
                </LeftContainer>

                <RightContainer>
                  <h2>Delivery em Andamento</h2>
                </RightContainer>
              </Content>
            </TabPane>
          ))}
        </Tabs>
      </PageContent>

      {/* <RouterDescription description="Delivery" />
      {cashier && cashier.is_opened ? (
        <>
          <PlatformContainer>
            <Radio.Group
              onChange={({ target: { value } }) => handlePlatform(value)}
              value={sale?.type}
            >
            </Radio.Group>
          </PlatformContainer>
          <MainContainer>
           
                </PaymentItem>
              </Radio.Group>
            </PaymentContainer>

            <RegisterContainer>
              {isLoading ? (
                <Spin />
              ) : (
                <>
                  <InputGroup>
                    <InputDescription>Valor do Delivery</InputDescription>

                    <InputPrice
                      autoFocus={true}
                      getValue={(value) => setAmount(value)}
                       onEnterPress={handleCreateSale}
                    />
                  </InputGroup>

                  <RegisterButton>Registrar</RegisterButton>

                  <RegisterButton onClick={() => handleCreateSale()}>
                    Registrar
                  </RegisterButton>
                </>
              )}
            </RegisterContainer>
          </MainContainer>
        </>
      ) : (
        <CashNotFound />
      )}
      <SalesContainer>
        {loadingSales ? (
          <Centralizer>
            <Spin />
          </Centralizer>
        ) : (
          <>
            {hasConnection ? (
              <>
                {sales.length ? (
                  <>
                    <SalesTable>
                      <SalesListHeader>
                        <Column sm={2}>
                          <Title>Código</Title>
                        </Column>
                        <Column sm={4}>
                          <Title>Valor Pedido</Title>
                        </Column>
                        <Column sm={4}>
                          <Title>Valor Produtos</Title>
                        </Column>
                        <Column sm={4}>
                          <Title>Valor Entrega</Title>
                        </Column>
                        <Column sm={5}>
                          <Title>Data Pedido</Title>
                        </Column>
                        <Column sm={5}>
                          <Title>Data Conclusão</Title>
                        </Column>
                      </SalesListHeader>
                      <SalesList>
                        {sales.map((sale) => (
                          <AppSale key={sale.id} {...sale} />
                        ))}
                      </SalesList>
                    </SalesTable>

                    <SalesDescription>
                      <span>Total em Dinheiro</span>
                      <label>{currencyFormater(appSalesResult?.money)}R$</label>
                      <span>Total em Débito</span>
                      <label>
                        {currencyFormater(appSalesResult?.debit_card)}R$
                      </label>
                      <span>Total em Crédito</span>
                      <label>
                        {currencyFormater(appSalesResult?.credit_card)}R$
                      </label>
                      <span>Total:</span>
                      <label>{currencyFormater(appSalesResult?.total)}R$</label>
                      <Button
                        type="primary"
                         onClick={() => handleUpdateProduct()}
                      >
                        Integrar
                      </Button>
                    </SalesDescription>
                  </>
                ) : (
                  <Centralizer>
                    <Empty description="Nenhuma venda localizada" />
                  </Centralizer>
                )}
              </>
            ) : (
              <DisconectedForm />
            )}
          </>
        )}
      </SalesContainer> */}
    </Container>
  );
};

export default withRouter(Delivery);
