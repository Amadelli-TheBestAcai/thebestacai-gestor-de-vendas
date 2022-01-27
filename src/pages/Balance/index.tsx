import React, { useState, useEffect } from "react";
import { PieChart } from "react-minimal-pie-chart";

import DisconectedForm from "../../containers/DisconectedForm";

import Spinner from "../../components/Spinner";
import pixImg from "../../assets/svg/pixIcon.svg";

import { currencyFormater } from "../../helpers/currencyFormater";
import { Balance as BalanceModel } from "../../models/balance";

import {
  Container,
  PageContent,
  Header,
  TabContainer,
  Tabs,
  Content,
  PaymentTypesContainer,
  PaymentTypes,
  ChartContainer,
  CardType,
  FooterContainer,
  LabelCardTab,
  TabPaneContainer,
  TabPane,
  IconContainer,
  MoneyIcon,
  CreditIcon,
  DebitIcon,
  OnlineIcon,
  PixIcon,
  LegendDescription,
} from "./styles";

const Balance: React.FC = () => {
  const [isConected, setIsConected] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [balance, setBalance] = useState<BalanceModel>();

  useEffect(() => {
    async function init() {
      const _storeCash = await window.Main.storeCash.getStoreCashBalance();
      const _isConnected = await window.Main.hasInternet();
      setBalance(_storeCash);
      setLoading(false);
      setIsConected(_isConnected);
    }
    init();
  }, []);

  const createTabPanes = (payload: BalanceModel) => {
    return [
      {
        id: "delivery",
        label: (
          <TabPaneContainer tab_id={1}>
            <LabelCardTab>
              <p>Delivery</p>
              <span>
                R$ {currencyFormater(+payload.delivery.total)}
                {/* R$ {balance?.delivery.total.toFixed(2).replace(".", ",")} */}
              </span>
            </LabelCardTab>
          </TabPaneContainer>
        ),
      },
      {
        id: "store",
        label: (
          <TabPaneContainer tab_id={2}>
            <LabelCardTab>
              <p>Loja</p>
              <span>R$ {currencyFormater(+payload.store.total)}</span>
            </LabelCardTab>
          </TabPaneContainer>
        ),
      },
      {
        id: "billing",
        label: (
          <TabPaneContainer tab_id={3}>
            <LabelCardTab>
              <p>Faturamento</p>
              <span>R$ {currencyFormater(+payload.billing.total)}</span>
            </LabelCardTab>
          </TabPaneContainer>
        ),
      },
    ];
  };

  const getPercent = (number: number, total: number): number => {
    if (!total) {
      return 100;
    }
    return +((+number * 100) / total).toFixed(2);
  };

  const createPaymentsPie = (tab: string, payload: BalanceModel) => {
    return [
      {
        id: "Dinheiro",
        value: getPercent(payload[tab].money, payload[tab].total),
        color: "var(--blue-700)",
      },
      {
        id: "Crédito",
        value: getPercent(payload[tab].credit, payload[tab].total),
        color: "var(--blue-350)",
      },
      {
        id: "Débito",
        value: getPercent(payload[tab].debit, payload[tab].total),
        color: "var(--blue-500)",
      },

      {
        id: "Pix",
        value: getPercent(payload[tab].pix, payload[tab].total),
        color: "var(--orange-700)",
      },
      {
        id: "Online",
        value: getPercent(
          tab === "store" ? payload[tab].ticket : payload[tab].online,
          payload[tab].total
        ),
        color: "var(--orange-400)",
      },
    ];
  };

  const createAmountTypePayments = (tab: string, payload: BalanceModel) => {
    return [
      {
        id: 1,
        icon: <MoneyIcon />,
        type: "DINHEIRO",
        value: payload[tab].money,
      },
      {
        id: 2,
        icon: <CreditIcon />,
        type: "CRÉDITO",
        value: payload[tab].credit,
      },
      {
        id: 3,
        icon: <DebitIcon />,
        type: "DÉBITO",
        value: payload[tab].debit,
      },
      {
        id: 4,
        icon: <PixIcon src={pixImg} />,
        type: "PIX",
        value: payload[tab].pix,
      },
      {
        id: 5,
        icon: <OnlineIcon />,
        type: "ONLINE",
        value: payload[tab].online,
      },
    ];
  };
  const legendGraph = [
    {
      label: "Dinheiro",
      color: "var(--blue-700)",
    },
    {
      label: "Crédito",
      color: "var(--blue-350)",
    },
    {
      label: "Débito",
      color: "var(--blue-500)",
    },
    {
      label: "Pix",
      color: "var(--orange-700)",
    },
    {
      label: "Online",
      color: "var(--orange-400)",
    },
  ];

  return (
    <Container>
      {isLoading ? (
        <Spinner />
      ) : isConected ? (
        <PageContent>
          <Header>
            <h2>Balanço</h2>
          </Header>

          <TabContainer>
            <Tabs defaultActiveKey="1">
              {createTabPanes(balance).map((_tab) => (
                <TabPane tab={_tab.label} key={_tab.id}>
                  <Content>
                    <h2>Estátisticas</h2>
                    <PaymentTypesContainer>
                      <PaymentTypes>
                        {createAmountTypePayments(_tab.id, balance).map(
                          (typePayment) => (
                            <CardType>
                              <IconContainer>{typePayment.icon}</IconContainer>
                              <p>{typePayment.type}</p>
                              <span>
                                R$ {currencyFormater(+typePayment.value)}
                              </span>
                            </CardType>
                          )
                        )}
                      </PaymentTypes>
                      <ChartContainer>
                        <PieChart
                          data={createPaymentsPie(_tab.id, balance)}
                          lineWidth={18}
                          rounded
                          background="var(--grey-70)"
                          label={({ x, y, dx, dy }) => (
                            <text
                              x={x}
                              y={y}
                              dx={dx}
                              dy={dy}
                              dominant-baseline="central"
                              text-anchor="middle"
                              style={{
                                fontSize: "0.6rem",
                                fill: "var(--grey-100)",
                              }}
                            >
                              R$ {currencyFormater(balance[_tab.id].total)}
                            </text>
                          )}
                          animate
                          labelPosition={0}
                        />
                      </ChartContainer>
                    </PaymentTypesContainer>
                    <FooterContainer>
                      <footer>
                        <span>Legenda Gráfico</span>
                        <LegendDescription>
                          {legendGraph.map((legend) => (
                            <div>
                              <div
                                id="circle"
                                style={{ background: `${legend.color}` }}
                              />
                              <span>{legend.label}</span>
                            </div>
                          ))}
                        </LegendDescription>
                      </footer>
                    </FooterContainer>
                  </Content>
                </TabPane>
              ))}
            </Tabs>
          </TabContainer>
        </PageContent>
      ) : (
        <DisconectedForm />
      )}
    </Container>
    /* 
      {isLoading ? (
        <Spinner />
      ) : isConected ? (
        <CardContainer>
          <Card>
            <CardHeader>DELIVERY</CardHeader>
            <CardBody>
              <CardRow style={{ background: "#4356FF", width: "100%" }}>
                <Title>
                  R$ {balance.delivery.total.toFixed(2).replace(".", ",")}
                </Title>
              </CardRow>
              <CardRow>
                <MoneyIcon />
                <CardContent>
                  R$ {balance.delivery.money.toFixed(2).replace(".", ",")}
                  <Description>Dinheiro</Description>
                </CardContent>
              </CardRow>
              <CardRow>
                <CreditIcon />
                <CardContent>
                  R$ {balance.delivery.credit.toFixed(2).replace(".", ",")}
                  <Description>Crédito</Description>
                </CardContent>
              </CardRow>
              <CardRow>
                <DebitIcon />
                <CardContent>
                  R$ {balance.delivery.debit.toFixed(2).replace(".", ",")}
                  <Description>Débito</Description>
                </CardContent>
              </CardRow>
              <CardRow>
                <img
                  src={PixLogo}
                  style={{
                    width: "3vw",
                    height: "5vh",
                    margin: "0% 7% 0% 13%",
                  }}
                />
                <CardContent>
                  R$ {balance.delivery.pix.toFixed(2).replace(".", ",")}
                  <Description>PIX</Description>
                </CardContent>
              </CardRow>
              <CardRow>
                <CheckOnline />
                <CardContent>
                  R$ {balance.delivery.online.toFixed(2).replace(".", ",")}
                  <Description>Online</Description>
                </CardContent>
              </CardRow>
            </CardBody>
            <CardFooter />
          </Card>
          <Card>
            <CardHeader style={{ background: "#007305" }}>LOJA</CardHeader>
            <CardBody green>
              <CardRow style={{ background: "#058A0A", width: "100%" }}>
                <Title>
                  R$ {balance.store.total.toFixed(2).replace(".", ",")}
                </Title>
              </CardRow>
              <CardRow green>
                <MoneyIcon />
                <CardContent>
                  R$ {balance.store.money.toFixed(2).replace(".", ",")}
                  <Description>Dinheiro</Description>
                </CardContent>
              </CardRow>
              <CardRow green>
                <CreditIcon />
                <CardContent>
                  R$ {balance.store.credit.toFixed(2).replace(".", ",")}
                  <Description>Crédito</Description>
                </CardContent>
              </CardRow>
              <CardRow green>
                <DebitIcon />
                <CardContent>
                  R$ {balance.store.debit.toFixed(2).replace(".", ",")}
                  <Description>Débito</Description>
                </CardContent>
              </CardRow>
              <CardRow green>
                <img
                  src={PixLogo}
                  style={{
                    width: "3vw",
                    height: "5vh",
                    margin: "0% 7% 0% 13%",
                  }}
                />
                <CardContent>
                  R$ {balance.store.pix.toFixed(2).replace(".", ",")}
                  <Description>PIX</Description>
                </CardContent>
              </CardRow>
              <CardRow green>
                <TicketIcon />
                <CardContent>
                  R$ {balance.store.ticket.toFixed(2).replace(".", ",")}
                  <Description>Ticket</Description>
                </CardContent>
              </CardRow>
            </CardBody>
            <CardFooter green />
          </Card>
          <Card>
            <CardHeader style={{ background: "#FF9D0A" }}>
              FATURAMENTO
            </CardHeader>
            <CardBody black fontWhite>
              <CardRow style={{ background: "#FF9D0A", width: "100%" }}>
                <Title>
                  R$ {balance.billing.total.toFixed(2).replace(".", ",")}
                </Title>
              </CardRow>
              <CardRow black>
                <CardContent>
                  <Description white>VENDAS</Description>
                  {balance.billing.sales}
                </CardContent>
              </CardRow>
              <CardRow black>
                <CardContent>
                  <Description white>VENDAS DELIVERY</Description>
                  {balance.billing.delivery_sales}
                </CardContent>
              </CardRow>
              <CardRow black>
                <CardContent>
                  <Description white>VENDAS LOJA</Description>
                  {balance.billing.store_sales}
                </CardContent>
              </CardRow>
              <CardRow black>
                <CardContent>
                  <Description white>TICKET MÉDIO DELIVERY</Description>
                  R${" "}
                  {balance.billing.delivery_ticket.toFixed(2).replace(".", ",")}
                </CardContent>
              </CardRow>
              <CardRow black>
                <CardContent>
                  <Description white>TICKET MÉDIO LOJA</Description>
                  R$ {balance.billing.store_ticket.toFixed(2).replace(".", ",")}
                </CardContent>
              </CardRow>
            </CardBody>
            <CardFooter black />
          </Card>
        </CardContainer>
      ) : (
        <DisconectedForm />
      )} */
  );
};

export default Balance;
