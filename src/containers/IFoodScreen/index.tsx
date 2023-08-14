import React, { useState, useEffect } from "react";

import { useUser } from "../../hooks/useUser";
import { useIfood } from "../../hooks/useIfood";
import { useSale } from "../../hooks/useSale";

import moment from "moment";
import { Checkbox, Empty, Dropdown, notification } from "antd";

import { EmptyContainer } from "../Items/styles";
import CardComponent from "../../components/OrderCardComponent";
import OrderPageIfood from "../../containers/OrderPageIfood";
import { CatalogDto } from "../../models/dtos/ifood/catalog";
import Spinner from "../../components/Spinner";
import { orderStatus } from "../../models/dtos/ifood/orderStatus";
import AuthIfood from "../AuthIfood";

import {
  Container,
  SideMenu,
  SearchIcon,
  ButtonPause,
  ContentGeneral,
  Button,
  ContentButton,
  Tabs,
  PageContent,
  Input,
  CardScheduled,
  ContentInsideMenu,
  TabPaneElement,
  ContentHome,
  CardHome,
  ContentSideMenu,
  Footer,
  Collapse,
  CollapseHeader,
  PanelAnt,
  PanelContent,
  ItemInfo,
  ItemDescription,
  ItemPrice,
  PlayIcon,
  PauseIcon,
  ContentSelect,
  ContentMenuItems,
  Option,
  Select,
  ContentCards,
  HeaderCard,
  ContentCollapse,
  ContentScroll,
  LoadingContainer,
  ContentTitleCollapse,
  TitleDisposition,
  ComplementalGroupName,
  DisplayLine,
  TitleDispositionBottom,
} from "./styles";

const screenTypes = [
  {
    id: 1,
    value: "agora",
  },
  {
    id: 2,
    value: "agendado",
  },
];

const IFoodScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [catalogItems, setCatalogItems] = useState<CatalogDto>();
  const [activeTab, setActiveTab] = useState("pedidos");
  const [selectedOption, setSelectedOption] = useState<string>("agora");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const { user } = useUser();
  const { ifood, setIfood } = useIfood();
  const { storeCash } = useSale();
  const currentDate = moment();
  const nextDate = moment().add(1, "day");

  const handleDeleteOrder = async (orderId: string) => {
    const updatedIfood = {
      ...ifood,
      orders: ifood.orders.filter((order) => order.id !== orderId),
    };
    setIfood(updatedIfood);
    await window.Main.ifood.update(updatedIfood);
  };

  const changeProductStatus = async (
    status: "AVAILABLE" | "UNAVAILABLE",
    category_id: string,
    catalog_id: string,
    product_id: string
  ) => {
    try {
      setLoading(true);
      await window.Main.ifood.updateProductStatus(
        status,
        catalog_id,
        category_id,
        product_id
      );
    } catch (error) {
      notification.error({
        message: "Oops, ocorreu um erro!",
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function getCatalog() {
      try {
        setLoading(true);
        const { response } = await window.Main.ifood.getCatalogs();
        setCatalogItems(response[0]);
      } catch (error) {
        notification.error({
          message: "Oops, ocorreu um erro!",
        });
      } finally {
        setLoading(false);
      }
    }
    if (activeTab === "cardapio") {
      getCatalog();
    }
  }, [activeTab]);

  useEffect(() => {
    if (!ifood || !selectedOrder) return;
    const newSelectedOrder = ifood.orders.filter(
      (item) => item.id === selectedOrder.id
    );
    setSelectedOrder(newSelectedOrder[0]);
  }, [ifood]);

  return (
    <>
      {storeCash?.is_opened && storeCash?.is_online ? (
        <>
          {!ifood?.token || !ifood?.refresh_token ? (
            <AuthIfood />
          ) : (
            <>
              {ifood.orders.length ? (
                <>
                  <Container>
                    <Tabs
                      activeKey={activeTab}
                      defaultActiveKey="pedidos"
                      onChange={(key) => setActiveTab(key)}
                    >
                      <TabPaneElement
                        active={activeTab === "pedidos"}
                        tab="Pedidos"
                        key="pedidos"
                      />
                      <TabPaneElement
                        active={activeTab === "cardapio"}
                        tab="Cardápio"
                        key="cardapio"
                      />
                    </Tabs>
                    {activeTab === "pedidos" ? (
                      <ContentGeneral>
                        <SideMenu>
                          <>
                            <ContentSelect>
                              <Select
                                value={selectedOption}
                                onChange={(value) =>
                                  setSelectedOption(String(value))
                                }
                              >
                                {screenTypes.map((item) => (
                                  <Option key={item.id} value={item.value}>
                                    {item.value}
                                  </Option>
                                ))}
                              </Select>
                            </ContentSelect>

                            {selectedOption === "agora" ? (
                              <ContentSideMenu>
                                <ContentButton>
                                  <Dropdown
                                    overlay={
                                      <div>
                                        <Checkbox.Group
                                          onChange={(checkedValues) =>
                                            setSelectedStatuses(checkedValues)
                                          }
                                          value={selectedStatuses}
                                        >
                                          <p>Status do Pedido</p>
                                          {Object.keys(orderStatus).map(
                                            (status) => (
                                              <div key={status}>
                                                <Checkbox value={status}>
                                                  {orderStatus[status]}
                                                </Checkbox>
                                              </div>
                                            )
                                          )}
                                        </Checkbox.Group>
                                      </div>
                                    }
                                    placement="bottomRight"
                                    trigger={["click"]}
                                    visible={dropdownVisible}
                                    onVisibleChange={(visible) =>
                                      setDropdownVisible(visible)
                                    }
                                  >
                                    <Button icon={<SearchIcon />}>
                                      {selectedStatuses.length > 0
                                        ? `${selectedStatuses.length} filtros aplicados`
                                        : "Aplicar filtro"}
                                    </Button>
                                  </Dropdown>
                                </ContentButton>
                                <ContentCards>
                                  {ifood.orders
                                    .filter(
                                      (order) =>
                                        selectedStatuses.length === 0 ||
                                        selectedStatuses.includes(
                                          order?.fullCode?.toLowerCase()
                                        )
                                    )
                                    .sort((a, b) =>
                                      b?.createdAt?.localeCompare(a.createdAt)
                                    )
                                    .map((order) => (
                                      <React.Fragment key={order.id}>
                                        <HeaderCard>
                                          {
                                            orderStatus[
                                              order?.fullCode?.toLowerCase()
                                            ]
                                          }{" "}
                                          <span>{ifood.orders.length}</span>
                                        </HeaderCard>
                                        <CardComponent
                                          order={order.displayId}
                                          delivery={order.orderType}
                                          fullCode={order.fullCode}
                                          orderOn={order.salesChannel}
                                          onClick={() =>
                                            setSelectedOrder(order)
                                          }
                                          onDeleteCard={() =>
                                            handleDeleteOrder(order.id)
                                          }
                                        />
                                      </React.Fragment>
                                    ))}
                                </ContentCards>

                                <Footer>
                                  <div className="content-footer">
                                    <div className="items">
                                      <span
                                        className="order-name"
                                        onClick={async () => {
                                          const { response } =
                                            await window.Main.ifood.update({
                                              is_opened: !ifood.is_opened,
                                            });
                                          setIfood(response);
                                        }}
                                      >
                                        Pedidos ({ifood?.orders.length}):
                                      </span>
                                      <span>
                                        R${" "}
                                        {ifood.orders
                                          .reduce((acc, order) => {
                                            const orderTotal =
                                              order?.items?.reduce(
                                                (orderAcc, item) => {
                                                  return orderAcc + item.price;
                                                },
                                                0
                                              );
                                            return (
                                              acc +
                                              orderTotal +
                                              order?.total?.deliveryFee
                                            );
                                          }, 0)
                                          .toLocaleString("pt-BR", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                          })}
                                      </span>
                                    </div>
                                    <div className="items">
                                      <span className="order-name">
                                        Online ({ifood?.orders.length}):{" "}
                                      </span>
                                      <span>Operando online</span>
                                    </div>
                                  </div>
                                </Footer>
                              </ContentSideMenu>
                            ) : (
                              <ContentInsideMenu>
                                <p>aqui vai ficar um card</p>
                                <ButtonPause>Pausar agendamento</ButtonPause>
                              </ContentInsideMenu>
                            )}
                          </>
                        </SideMenu>
                        <PageContent>
                          {selectedOrder ? (
                            <OrderPageIfood
                              key={selectedOrder.id}
                              order={selectedOrder}
                              closePage={() => setSelectedOrder(null)}
                            />
                          ) : (
                            <>
                              {selectedOption === "agora" ? (
                                <Container>
                                  <h1>👋 Olá, {user.name}</h1>
                                  <ContentHome>
                                    <CardHome>
                                      <h3>Horário de funcionamento:</h3>
                                      <div className="container-card">
                                        <div className="content">
                                          <span>
                                            Hoje, {currentDate.format("DD/MM")}{" "}
                                          </span>
                                          <span className="hourTime">
                                            00:00 - 23:59
                                          </span>
                                        </div>
                                        <div className="content">
                                          <span>
                                            Amanhã, {nextDate.format("DD/MM")}
                                          </span>
                                          <span className="hourTime">
                                            00:00 - 23:59
                                          </span>
                                        </div>
                                      </div>
                                    </CardHome>
                                    <CardHome>
                                      <h3>Itens pausados no cardápio:</h3>
                                      <p>0</p>
                                    </CardHome>
                                  </ContentHome>
                                </Container>
                              ) : (
                                <ContentGeneral>
                                  <CardScheduled>
                                    <h2>Pedidos agendados</h2>
                                    <p>
                                      Aqui você encontra os{" "}
                                      <b>pedidos agendados</b> feitos na sua
                                      loja
                                    </p>
                                    <p>
                                      O agendamento ajuda a prever a demanda que
                                      virá para a sua cozinha e seus
                                      entregadores
                                    </p>
                                    <p>
                                      Os pedidos agendados irão para a aba{" "}
                                      <b>"Agora"</b> quando estiver faltando o
                                      tempo de entrega configurado no seu
                                      restaurante. Você poderá confirmar ou
                                      cancelar o pedido clicando em "Rejeitar
                                      pedido".
                                    </p>
                                  </CardScheduled>
                                </ContentGeneral>
                              )}
                            </>
                          )}
                        </PageContent>
                      </ContentGeneral>
                    ) : (
                      <Container>
                        <ContentScroll>
                          <ContentMenuItems>
                            <h1>Cardápio</h1>

                            <p>
                              <b>Pause</b> ou <b>ative rapidamente os itens</b>{" "}
                              do cardápio da sua loja por aqui. Para fazer
                              edições como incluir, excluir itens ou fotos,{" "}
                              <br />
                              acesse o Portal do Parceiro.
                            </p>
                            <p>
                              As alterações dos cardápios podem demorar até 5
                              minutos para aparecerem aos clientes
                            </p>

                            <Input
                              prefix={<SearchIcon />}
                              placeholder="Buscar item do cardápio"
                            />

                            {loading ? (
                              <LoadingContainer>
                                <Spinner />
                              </LoadingContainer>
                            ) : (
                              <ContentCollapse>
                                {catalogItems?.categories?.map((category) => (
                                  <Collapse
                                    expandIconPosition="right"
                                    key={category.id}
                                  >
                                    <CollapseHeader>
                                      <span>{category.name}</span>
                                      <button
                                        onClick={() =>
                                          changeProductStatus(
                                            category.status === "AVAILABLE"
                                              ? "UNAVAILABLE"
                                              : "AVAILABLE",
                                            category.id,
                                            catalogItems.catalogId,
                                            ""
                                          )
                                        }
                                      >
                                        {category.status === "AVAILABLE" ? (
                                          <PauseIcon />
                                        ) : (
                                          <PlayIcon />
                                        )}
                                      </button>
                                    </CollapseHeader>

                                    {category.items?.map((item) => (
                                      <PanelAnt
                                        header={
                                          <ContentTitleCollapse>
                                            <TitleDisposition>
                                              {item.name}
                                              <ItemDescription>
                                                {item.description}
                                              </ItemDescription>
                                            </TitleDisposition>

                                            <ItemPrice>
                                              R$ {item.price.value.toFixed(2)}
                                            </ItemPrice>
                                            {/* <button onClick={() => setIsPlaying((prevState) => !prevState)}>
                                        {isPlaying ? <PauseIcon /> : <PlayIcon />}
                                      </button> */}
                                          </ContentTitleCollapse>
                                        }
                                        key={item.id}
                                      >
                                        <PanelContent>
                                          <ItemInfo>
                                            {item.optionGroups?.map(
                                              (optionGroup) => (
                                                <div key={optionGroup.id}>
                                                  <ComplementalGroupName>
                                                    {optionGroup.name}
                                                  </ComplementalGroupName>

                                                  {optionGroup.options.map(
                                                    (option) => (
                                                      <TitleDisposition>
                                                        <DisplayLine
                                                          key={option.id}
                                                        >
                                                          <span>
                                                            {option.name}
                                                          </span>

                                                          <TitleDispositionBottom>
                                                            <span>
                                                              R${" "}
                                                              {
                                                                option.price
                                                                  .value
                                                              }
                                                            </span>
                                                            {/* <button onClick={() => setIsPlaying((prevState) => !prevState)}>
                                                      {isPlaying ? <PauseIcon /> : <PlayIcon />}
                                                    </button> */}
                                                          </TitleDispositionBottom>
                                                        </DisplayLine>
                                                      </TitleDisposition>
                                                    )
                                                  )}
                                                </div>
                                              )
                                            )}
                                          </ItemInfo>
                                        </PanelContent>
                                      </PanelAnt>
                                    ))}
                                  </Collapse>
                                ))}
                              </ContentCollapse>
                            )}
                          </ContentMenuItems>
                        </ContentScroll>
                      </Container>
                    )}
                  </Container>
                </>
              ) : (
                <>Nenhum pedido encontrado</>
              )}
            </>
          )}
        </>
      ) : (
        <EmptyContainer>
          <Empty description="O caixa deve estar online" />
        </EmptyContainer>
      )}
    </>
  );
};

export default IFoodScreen;
