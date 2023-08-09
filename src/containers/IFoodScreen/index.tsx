import React, { useState, useEffect } from "react";

import CardComponent from "../../components/OrderCardComponent";
import OrderPageIfood from "../../containers/OrderPageIfood";
import AuthIfood from "../AuthIfood";
import { useUser } from "../../hooks/useUser";
const { Option } = Select;

import {
  Container,
  Select,
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
} from "./styles";
import { useIfood } from "../../hooks/useIfood";

const TesteModule = [
  {
    id: 1,
    title: ["Categoria item normal"],
    item: "Sanduíche",
    description: "lorem ipsum",
    price: "R$10,00",
  },
  {
    id: 2,
    title: "Categoria 2",
    item: "Açaí",
    description: "hasiuhcfiah",
    price: "R$10,00",
  },
  {
    id: 3,
    title: "Categoria 333",
    item: "Pão com mandioca",
    description: "lorem ipsum",
    price: "R$10,00",
  },
];

const IFoodScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [codeVerifier, setCodeVerifier] = useState<any>();
  const [activeTab, setActiveTab] = useState("pedidos");
  const [selectedOption, setSelectedOption] = useState<string>("agora");
  const [totalChecked, setTotalChecked] = useState(0);
  const [auth, setAuth] = useState<any>();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [filters, setFilters] = useState({
    statusChecked: false,
    channelChecked: false,
    othersChecked: false,
  });
  const { user } = useUser();
  const { ifood, setIfood } = useIfood();

  const handleCheckboxChange = (checkboxName, isChecked) => {
    setFilters({ ...filters, [checkboxName]: isChecked });

    const checkedCount = Object.values({
      ...filters,
      [checkboxName]: isChecked,
    }).filter(Boolean).length;
    setTotalChecked(checkedCount);
  };

  const menuCheckbox = (
    <div>
      <FilterCheckbox
        checked={filters.statusChecked}
        onChange={(e) =>
          handleCheckboxChange("statusChecked", e.target.checked)
        }
      >
        Teste
      </FilterCheckbox>

      <FilterCheckbox
        checked={filters.channelChecked}
        onChange={(e) =>
          handleCheckboxChange("channelChecked", e.target.checked)
        }
      >
        Teste2
      </FilterCheckbox>

      <FilterCheckbox
        checked={filters.othersChecked}
        onChange={(e) =>
          handleCheckboxChange("othersChecked", e.target.checked)
        }
      >
        Teste3
      </FilterCheckbox>
    </div>
  );

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

  return (
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
                    #
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
                          overlay={menuCheckbox}
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

                      {ifood.orders.map((order) => (
                        <CardComponent
                          key={order.id}
                          delivery="teste2"
                          order="333"
                          status="teste"
                          onClick={() => {}}
                        />
                      ))}

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
                              Pedidos (0):{" "}
                            </span>
                            <span>R$ 0,00</span>
                          </div>
                          <div className="items">
                            <span className="order-name">Online (0): </span>
                            {/* <span>R$ 0,00</span> */}
                            <span>{ifood?.updated_at.toISOString()}</span>
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
                            <span>Hoje, 02/08</span>
                            <span className="hourTime">00:00 - 23:59</span>
                          </div>
                          <div className="content">
                            <span>Hoje, 02/08</span>
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

                <Collapse expandIconPosition="right">
                  <CollapseHeader>
                    <span>Categoria item</span>
                    <button
                      onClick={() => setIsPlaying((prevState) => !prevState)}
                    >
                      {isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </button>
                  </CollapseHeader>

                  {TesteModule.map((_module) => (
                    <PanelAnt
                      header={
                        <div>
                          {_module.item}
                          <ItemDescription style={{ marginLeft: "1rem" }}>
                            {_module.description}
                          </ItemDescription>
                        </div>
                      }
                      key={_module.id}
                    >
                      <PanelContent>
                        <ItemInfo>
                          <ItemTitle>{_module.title}</ItemTitle>

                          <ContentPrice>
                            <ItemDescription>
                              {_module.description}
                            </ItemDescription>

                            <div>
                              <ItemPrice>{_module.price}</ItemPrice>
                              <button
                                onClick={() =>
                                  setIsPlaying((prevState) => !prevState)
                                }
                              >
                                {isPlaying ? (
                                  <PauseIcon size={5} />
                                ) : (
                                  <PlayIcon size={5} />
                                )}
                              </button>
                            </div>
                          </ContentPrice>
                        </ItemInfo>
                      </PanelContent>
                    </PanelAnt>
                  ))}
                </Collapse>
              </ContentMenuItems>
            </Container>
          )}
        </Container>
      )}
    </>
  );
};

export default IFoodScreen;
