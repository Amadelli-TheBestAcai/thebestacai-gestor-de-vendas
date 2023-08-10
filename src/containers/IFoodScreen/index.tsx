import React, { useState, useEffect } from "react";
import { Empty, notification } from "antd";
import CardComponent from "../../components/OrderCardComponent";
import OrderPageIfood from "../../containers/OrderPageIfood";
import AuthIfood from "../AuthIfood";
import { useUser } from "../../hooks/useUser";
import { useIfood } from "../../hooks/useIfood";
import { useSale } from "../../hooks/useSale";
import { CatalogDto } from "../../models/dtos/ifood/catalog";
import { EmptyContainer } from "../Items/styles";

import {
  Container,
  SideMenu,
  SearchIcon,
  ButtonPause,
  ContentGeneral,
  Button,
  ContentButton,
  Tabs,
  InputWithSearchIcon,
  FilterCheckbox,
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
  ItemTitle,
  ItemDescription,
  ItemPrice,
  ContentPrice,
  PlayIcon,
  PauseIcon,
  Dropdown,
  ContentSelect,
  ContentMenuItems,
  Option,
  Select,
  ContentCards,
  HeaderCard,
  ContentCollapse,
  ContentScroll,
  LoadingContainer
} from "./styles";
import moment from "moment";
import Spinner from "../../components/Spinner";

const screenTypes = [
  {
    id: 1,
    value: "agora",
  },
  {
    id: 2,
    value: "agendado",
  },
  {
    id: 3,
    value: "card",
  },
];

const IFoodScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [catalogItems, setCatalogItems] = useState<CatalogDto>();
  const [activeTab, setActiveTab] = useState("pedidos");
  const [selectedOption, setSelectedOption] = useState<string>("agora");
  const [totalChecked, setTotalChecked] = useState(0);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const { user } = useUser();
  const { ifood, setIfood } = useIfood();
  const { storeCash } = useSale();
  const currentDate = moment();
  const nextDate = moment().add(1, 'day');

  useEffect(() => {
    console.log(catalogItems, 'TESTE')
  }, [])

  useEffect(() => {
    async function getCatalog() {
      try {
        setLoading(true)
        const { response } = await window.Main.ifood.getCatalogs();
        setCatalogItems(response[0])
      } catch (error) {
        notification.error({
          message: "Oops, ocorreu um erro!"
        })
      } finally {
        setLoading(false)
      }
    }
    if (activeTab === "cardapio") {
      getCatalog();
    }
  }, [activeTab]);

  return (
    <>
      {storeCash?.is_opened && storeCash?.is_online ? (
        <>
          {!ifood?.token || !ifood?.refresh_token ? (
            <AuthIfood />
          ) : (
            <Container>
              <Tabs
                activeKey={activeTab}
                defaultActiveKey="pedidos"
                onChange={(key) => setActiveTab(key)}
              >
                <TabPaneElement tab="Pedidos" key="pedidos" />
                <TabPaneElement tab="Cardápio" key="cardapio" />
              </Tabs>
              {activeTab === "pedidos" ? (
                <ContentGeneral>
                  <SideMenu>
                    <>
                      <ContentSelect>
                        <Select
                          value={selectedOption}
                          onChange={(value) => setSelectedOption(String(value))}
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
                            <InputWithSearchIcon
                              placeholder="Buscar pedido"
                              prefix={<SearchIcon />}
                            />
                            <Dropdown
                              overlay={<p>teste</p>}
                              placement="bottomRight"
                              trigger={["click"]}
                              visible={dropdownVisible}
                              onVisibleChange={(visible) =>
                                setDropdownVisible(visible)
                              }
                            >
                              <Button icon={<SearchIcon />}>
                                {totalChecked > 0 && `${totalChecked}`} Aplicar
                                filtro
                              </Button>
                            </Dropdown>
                          </ContentButton>
                          <ContentCards>
                            {ifood.orders.map((order) => {
                              return (
                                <>
                                  <HeaderCard>
                                    {order.fullCode} <span>{ifood.orders.length}</span>
                                  </HeaderCard>
                                  <CardComponent
                                    key={order.id}
                                    order={order.displayId}
                                    delivery={order.orderType}
                                    message={order.delivery.observations}
                                    onClick={() => { }}
                                  />
                                </>
                              )
                            })}
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
                                  R$ {ifood.orders.reduce((acc, order) => {
                                    const orderTotal = order.items.reduce((orderAcc, item) => {
                                      return orderAcc + item.price;
                                    }, 0);
                                    return acc + orderTotal;
                                  }, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                              </div>
                              <div className="items">
                                <span className="order-name">Online ({ifood?.orders.length}): </span>
                                {/* <span>R$ 0,00</span> */}
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
                    {selectedOption === "agora" ? (
                      <Container>
                        <h1>👋 Olá, {user.name}</h1>
                        <ContentHome>
                          <CardHome>
                            <h3>Horário de funcionamento:</h3>

                            <div className="container-card">
                              <div className="content">
                                <span>Hoje, {currentDate.format('DD/MM')} </span>
                                <span className="hourTime">00:00 - 23:59</span>
                              </div>
                              <div className="content">
                                <span>Amanhã, {nextDate.format('DD/MM')}</span>
                                <span className="hourTime">00:00 - 23:59</span>
                              </div>
                            </div>
                          </CardHome>
                          <CardHome>
                            <h3>Itens pausados no cardápio:</h3>
                            <p>0</p>
                          </CardHome>
                        </ContentHome>
                      </Container>
                    ) : selectedOption === "agendado" ? (
                      <ContentGeneral>
                        <CardScheduled>
                          <h2>Pedidos agendados</h2>

                          <p>
                            Aqui você encontra os <b>pedidos agendados</b> feitos na
                            sua loja
                          </p>
                          <p>
                            O agendamento ajuda a prever a demanda que virá para a
                            sua cozinha e seus entregadores
                          </p>
                          <p>
                            Os pedidos agendados irão para a aba <b>"Agora"</b>{" "}
                            quando estiver faltando o tempo de entrega configurado
                            no seu restaurante. Você poderá confirmar ou cancelar o
                            pedido clicando em "Rejeitar pedido".
                          </p>
                        </CardScheduled>
                      </ContentGeneral>
                    ) : (
                      selectedOption === "card" && <OrderPageIfood />
                    )}
                  </PageContent>
                </ContentGeneral>
              ) : (
                <Container>
                  <ContentScroll>
                    <ContentMenuItems>
                      <h1>Cardápio</h1>

                      <p>
                        <b>Pause</b> ou <b>ative rapidamente os itens</b> do cardápio
                        da sua loja por aqui. Para fazer edições como incluir, excluir
                        itens ou fotos, <br />
                        acesse o{" "}
                        <a
                          href="https://portal.ifood.com.br/menu"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Portal do Parceiro.
                        </a>
                      </p>
                      <p>
                        As alterações dos cardápios podem demorar até 5 minutos para
                        aparecerem aos clientes
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
                            <Collapse expandIconPosition="right" key={category.id}>
                              <CollapseHeader>
                                <span>{category.name}</span>
                                <button onClick={() => setIsPlaying((prevState) => !prevState)}>
                                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                                </button>
                              </CollapseHeader>

                              {category.items?.map((item) => (
                                <PanelAnt header={<div>{item.name}</div>} key={item.id}>
                                  <PanelContent>
                                    <ItemInfo>
                                      <ItemTitle>{item.name}</ItemTitle>

                                      <ContentPrice>
                                        <ItemDescription>
                                          {item.description}
                                        </ItemDescription>

                                        <ItemPrice>{item.price.value}</ItemPrice>
                                        <button onClick={() => setIsPlaying((prevState) => !prevState)}>
                                          {isPlaying ? (
                                            <PauseIcon size={5} />
                                          ) : (
                                            <PlayIcon size={5} />
                                          )}
                                        </button>
                                      </ContentPrice>

                                      {item.optionGroups?.map((optionGroup) => (
                                        <div key={optionGroup.id}>
                                          <div>{optionGroup.name}</div>

                                          {optionGroup.options.map((option) => (
                                            <div key={option.id}>{option.name}</div>
                                          ))}
                                        </div>
                                      ))}
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
          )}
        </>) : (
        <EmptyContainer>
          <Empty description="O caixa deve estar online" />
        </EmptyContainer>
      )}
    </>
  );
};

export default IFoodScreen;
