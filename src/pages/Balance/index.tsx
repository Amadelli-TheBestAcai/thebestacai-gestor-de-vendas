import React, { useState, useEffect } from "react";
import { PieChart } from "react-minimal-pie-chart";

import DisconectedForm from "../../containers/DisconectedForm";

import Spinner from "../../components/Spinner";
import CashNotFound from "../../components/CashNotFound";
import pixImg from "../../assets/svg/pixIcon.svg";

import { currencyFormater } from "../../helpers/currencyFormater";
import { Balance as BalanceModel } from "../../models/dtos/balance";
import { StoreCashDto } from "../../models/dtos/storeCash";

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
  TicketIcon,
  MinusIcon,
} from "./styles";
import { notification } from "antd";

const Balance: React.FC = () => {
  const [isConected, setIsConected] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [balance, setBalance] = useState<BalanceModel | null>(null);
  const [currentTab, setCurrentTab] = useState("delivery");
  const [storeCash, setStoreCash] = useState<StoreCashDto | null>(null);

  useEffect(() => {
    async function init() {
      const { response: _balance, has_internal_error: errorOnBalance } =
        await window.Main.storeCash.getStoreCashBalance();
      if (errorOnBalance) {
        return notification.error({
          message: "Erro ao encontrar o balanço",
          duration: 5,
        });
      }
      const _isConnected = await window.Main.hasInternet();
      const { response: _storeCash } = await window.Main.storeCash.getCurrent();
      setStoreCash(_storeCash);
      setBalance(_balance);
      setLoading(false);
      setIsConected(_isConnected);
    }
    init();
  }, []);

  const createTabPanes = (payload?: BalanceModel) => {
    return [
      {
        id: "delivery",
        label: (
          <TabPaneContainer tab_id={1}>
            <LabelCardTab>
              <p>Delivery</p>
              <span>R$ {currencyFormater(+payload?.delivery?.total)}</span>
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
              <span>R$ {currencyFormater(+payload?.store?.total)}</span>
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
              <span>R$ {currencyFormater(+payload?.billing?.total)}</span>
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

  const createPaymentsPie = (tab: string, payload?: BalanceModel) => {
    return [
      {
        id: "Dinheiro",
        value: getPercent(payload[tab]?.money, payload[tab]?.total),
        color: "var(--blue-700)",
      },
      {
        id: "Crédito",
        value: getPercent(payload[tab]?.credit, payload[tab]?.total),
        color: "var(--blue-350)",
      },
      {
        id: "Débito",
        value: getPercent(payload[tab]?.debit, payload[tab]?.total),
        color: "var(--blue-500)",
      },
      {
        id: "Pix",
        value: getPercent(payload[tab]?.pix, payload[tab]?.total),
        color: "var(--orange-700)",
      },
      {
        id: tab === "store" ? "Ticket" : "Online",
        value: getPercent(
          tab === "store" ? payload[tab]?.ticket : payload[tab]?.online,
          payload[tab].total
        ),
        color: tab === "store" ? "var(--purple-450)" : "var(--orange-400)",
      },
    ];
  };

  const createAmountTypePayments = (tab: string, payload: BalanceModel) => {
    const response = [];

    if (tab === "store" || tab === "delivery") {
      response.push(
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
        }
      );
    }

    if (tab === "store") {
      response.push({
        id: 5,
        icon: <TicketIcon />,
        type: "TICKET",
        value: payload[tab].ticket,
      });
    }

    if (tab === "delivery") {
      response.push({
        id: 6,
        icon: <OnlineIcon />,
        type: "ONLINE",
        value: payload[tab].online,
      });
    }

    if (tab === "billing") {
      response.push(
        {
          id: 7,
          icon: <MinusIcon />,
          type: "VENDAS",
          value: payload[tab].sales,
        },
        {
          id: 8,
          icon: <MinusIcon />,
          type: "VENDAS DELIVERY",
          value: payload[tab].delivery_sales,
        },
        {
          id: 9,
          icon: <MinusIcon />,
          type: "VENDAS LOJA",
          value: payload[tab].store_sales,
        },
        {
          id: 10,
          icon: <MinusIcon />,
          type: "TICKET MÉDIO DELIVERY",
          value: payload[tab].delivery_ticket,
        },
        {
          id: 11,
          icon: <MinusIcon />,
          type: "TICKET MÉDIO LOJA",
          value: payload[tab].store_ticket,
        }
      );
    }

    return response;
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
      label: "Ticket",
      color: "var(--purple-450)",
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
        <>
          {" "}
          {storeCash?.is_opened ? (
            <PageContent>
              <Header>
                <h2>Balanço</h2>
              </Header>

              <TabContainer>
                <Tabs
                  defaultActiveKey="1"
                  onChange={(id_tab) => setCurrentTab(id_tab)}
                >
                  {createTabPanes(balance).map((_tab) => (
                    <TabPane tab={_tab.label} key={_tab.id}>
                      <Content>
                        <h2>Estátisticas</h2>
                        <PaymentTypesContainer>
                          <PaymentTypes>
                            {createAmountTypePayments(_tab.id, balance).map(
                              (typePayment) => (
                                <CardType>
                                  <IconContainer>
                                    {typePayment.icon}
                                  </IconContainer>
                                  <p>{typePayment.type}</p>

                                  {_tab.id !== "billing" ? (
                                    <span>
                                      R$ {currencyFormater(+typePayment.value)}
                                    </span>
                                  ) : (
                                    <>
                                      {typePayment.id === 10 ||
                                      typePayment.id === 11 ? (
                                        <span>
                                          R${" "}
                                          {currencyFormater(+typePayment.value)}
                                        </span>
                                      ) : (
                                        <span>{+typePayment.value}</span>
                                      )}
                                    </>
                                  )}
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
            <CashNotFound />
          )}
        </>
      ) : (
        <DisconectedForm />
      )}
    </Container>
  );
};

export default Balance;
