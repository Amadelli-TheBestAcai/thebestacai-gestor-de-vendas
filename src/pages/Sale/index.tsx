import React, { useState, useEffect } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import moment from "moment";
import { currencyFormater } from "../../helpers/currencyFormater";
import DisconectedForm from "../../containers/DisconectedForm";
import SalesHistory from "../../containers/SalesHistory";
import Centralizer from "../../containers/Centralizer";
import RouterDescription from "../../components/RouterDescription";
import Spinner from "../../components/Spinner";
import SaleItem from "../../components/Sale";

import { PaymentType } from "../../models/enums/paymentType";
import { SalesTypes } from "../../models/enums/salesTypes";
import { SaleFromApi } from "../../models/dtos/salesFromApi";

import notHandler from "../../assets/svg/notHandler.svg";
import { Empty, notification, Tooltip } from "antd";

import {
  Container,
  PageContent,
  Header,
  SearchContainer,
  Input,
  ListSaleContainer,
  Row,
  Col,
  Panel,
  Collapse,
  HeaderTable,
  SalesHistoryContainer,
  HeaderCollapse,
  PrinterIcon,
  RemoveIcon,
  RestoreIcon,
} from "./styles";

type IProps = RouteComponentProps;

const Sale: React.FC<IProps> = ({ history }) => {
  const [shouldSearch, setShouldSearch] = useState(true);
  const [selectedSale, setSelectedSale] = useState<SaleFromApi | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingSales, setPendingSales] = useState<number>(0);
  const [isIntegrating, setIsIntegrating] = useState<boolean>(false);
  const [sales, setSales] = useState<SaleFromApi[]>([]);
  const [isConected, setIsConected] = useState<boolean>(true);

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      const { response: _sales, has_internal_error: errorOnGetSaleFromApi } =
        await window.Main.sale.getSaleFromApi();
      if (errorOnGetSaleFromApi) {
        return notification.error({
          message: "Erro ao obter vendas",
          duration: 5,
        });
      }

      const payload = _sales.map((_sale) => ({
        ..._sale,
        total_sold: _sale.items.reduce(
          (total, _item) => total + _item.total,
          0
        ),
      }));

      if (_sales.length) {
        setSelectedSale(payload[0]);
      }
      setSales(payload);
      setIsLoading(false);
      // ipcRenderer.send('integrate:status')
      // ipcRenderer.once('integrate:status:response', (event, { sales }) => {
      //   setPendingSales(sales?.length)
      // })
      setShouldSearch(false);
    }
    if (shouldSearch) {
      init();
    }
  }, [shouldSearch]);

  // const onDelete = (id: string): void => {
  //   confirm({
  //     content: "Tem certeza que gostaria de remover esta venda",
  //     okText: "Sim",
  //     okType: "default",
  //     cancelText: "Não",
  //     async onOk() {
  //       setIsLoading(true);
  //       const success = await window.Main.sale.deleteSaleFromApi(id);
  //       if (!success) {
  //         message.warning("Falha ao remover venda");
  //       }
  //       const _sale = await window.Main.sale.getSaleFromApi();
  //       setSales(_sale);
  //       message.success("Venda removida com sucesso");
  //       setIsLoading(false);
  //     },
  //   });
  // };

  // const handleIntegrate = () => {
  //   setIsIntegrating(true)
  //   ipcRenderer.send('integrate:integrate')
  //   ipcRenderer.once('integrate:integrate:response', (event, status) => {
  //     setIsIntegrating(false)
  //     if (status) {
  //       Modal.confirm({
  //         title: 'Integração de vendas concluida.',
  //         content:
  //           'As vendas foram enviadas com sucesso e estão sendo processadas. Pode levar alguns minutos até que todas sejam processadas e salvas pelo servidor.',
  //         onOk() {
  //           return history.push('/home')
  //         },
  //         cancelButtonProps: { hidden: true },
  //       })
  //     } else {
  //       message.error('Houve um erro na tentativa de integrar as vendas.')
  //     }
  //     setPendingSales(sales?.length)
  //   })
  // }

  return (
    <Container>
      <PageContent>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {sales.length ? (
              <>
                <Header>
                  <h2>Vendas</h2>
                </Header>
                <SearchContainer>
                  <Input placeholder="Digite a identificação da venda" />
                </SearchContainer>
                <ListSaleContainer>
                  <HeaderTable>
                    <Col sm={4}>ID</Col>
                    <Col sm={4}>VALOR</Col>
                    <Col sm={4}>QUANTIDADE</Col>
                    <Col sm={4}>HORA</Col>
                    <Col sm={4}>TIPO</Col>
                    <Col sm={4}>AÇÕES</Col>
                  </HeaderTable>
                  {selectedSale && (
                    <Collapse defaultActiveKey={["1"]} collapsible="disabled">
                      <Panel
                        header={
                          <>
                            <Col sm={4}>{selectedSale.id}</Col>
                            <Col sm={4}> R$ {selectedSale.total_sold}</Col>
                            <Col sm={4}>{selectedSale.quantity}</Col>
                            <Col sm={4}>
                              {moment(selectedSale.created_at)
                                .add(3, "hours")
                                .format("HH:mm:ss")}
                            </Col>
                            <Col sm={4}>{SalesTypes[selectedSale.type]}</Col>
                            <Col
                              sm={4}
                              style={{ justifyContent: "space-evenly" }}
                            >
                              <Tooltip title="Remover" placement="bottom">
                                <RemoveIcon />
                              </Tooltip>
                              <Tooltip title="Restaurar" placement="bottom">
                                <RestoreIcon />
                              </Tooltip>
                              <Tooltip title="Imprimir" placement="bottom">
                                <PrinterIcon />
                              </Tooltip>
                            </Col>
                          </>
                        }
                        key="1"
                      >
                        <Collapse defaultActiveKey={["2"]}>
                          <Panel header="Pagamentos" key="2">
                            <HeaderCollapse>
                              <Col sm={12}>TIPO</Col>
                              <Col sm={12}>VALOR</Col>
                            </HeaderCollapse>
                            {selectedSale.payments.map((_payment, index) => (
                              <Row key={index}>
                                <Col sm={12}>{PaymentType[_payment.type]}</Col>
                                <Col sm={12}>R$ {_payment.amount}</Col>
                              </Row>
                            ))}
                          </Panel>
                        </Collapse>
                        {selectedSale.items.length ? (
                          <Collapse defaultActiveKey={["3"]}>
                            <Panel header="Itens" key="2">
                              <HeaderCollapse>
                                <Col sm={8}>PRODUTO</Col>
                                <Col sm={8}>QUANTIDADE</Col>
                                <Col sm={8}>PREÇO</Col>
                              </HeaderCollapse>
                              {selectedSale.items.map((_item, index) => (
                                <Row key={index}>
                                  <Col sm={8}>{_item.product.name}</Col>
                                  <Col sm={8}>{_item.quantity}</Col>
                                  <Col sm={8}>
                                    R${" "}
                                    {currencyFormater(
                                      +_item.quantity *
                                        +_item.storeProduct.price_unit
                                    )}
                                  </Col>
                                </Row>
                              ))}
                            </Panel>
                          </Collapse>
                        ) : (
                          <p>📌Vendas em delivery não possuem itens</p>
                        )}
                      </Panel>
                    </Collapse>
                  )}
                </ListSaleContainer>
                <SalesHistoryContainer>
                  <SalesHistory
                    sales={sales}
                    setSelectedSale={setSelectedSale}
                  />
                </SalesHistoryContainer>
              </>
            ) : (
              <Centralizer>
                <Empty
                  description="Nenhuma venda registrada para ser listada."
                  image={notHandler}
                  imageStyle={{
                    height: 350,
                  }}
                />
              </Centralizer>
            )}
          </>
        )}
      </PageContent>
    </Container>
  );
};

export default withRouter(Sale);
