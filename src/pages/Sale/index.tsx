import React, { useState, useEffect } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import DisconectedForm from "../../containers/DisconectedForm";
import SalesHistory from "../../containers/SalesHistory";
import Centralizer from "../../containers/Centralizer";
import RouterDescription from "../../components/RouterDescription";
import Spinner from "../../components/Spinner";
import SaleItem from "../../components/Sale";

import { SaleDto } from "../../models/dtos/sale";

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
} from "./styles";

type IProps = RouteComponentProps;

const Sale: React.FC<IProps> = ({ history }) => {
  const [shouldSearch, setShouldSearch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingSales, setPendingSales] = useState<number>(0);
  const [isIntegrating, setIsIntegrating] = useState<boolean>(false);
  const [sales, setSales] = useState<SaleDto[]>([]);
  const [isConected, setIsConected] = useState<boolean>(true);

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      const _sale = await window.Main.sale.getSaleFromApi();
      setSales(_sale);
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
          <Collapse defaultActiveKey={["1"]} collapsible="disabled">
            <Panel header="This is panel header 1" key="1">
              <Collapse defaultActiveKey={["2"]}>
                <Panel header="Pagamentos" key="2">
                  <p>2</p>
                </Panel>
              </Collapse>
              <Collapse defaultActiveKey={["3"]}>
                <Panel header="Itens" key="2">
                  <p>2</p>
                </Panel>
              </Collapse>
            </Panel>
          </Collapse>
        </ListSaleContainer>
        <SalesHistoryContainer>
          <SalesHistory />
        </SalesHistoryContainer>
      </PageContent>
      {/* <RouterDescription description="Vendas" />
      {isLoading ? (
        <Spinner />
      ) : isConected ? (
        <>
          {pendingSales !== 0 && (
            <Row
              justify="center"
              align="middle"
              style={{ width: "100%", margin: "10px 0" }}
            >
              <Title style={{ color: "#969696" }}>
                Há vendas que ainda não foram integradas. Clique em Enviar para
                integrar.
              </Title>
              <Button
                type="primary"
                style={{ marginLeft: 10 }}
                loading={isIntegrating}
                // onClick={() => handleIntegrate()}
              >
                Enviar
              </Button>
            </Row>
          )}
          <>
            {sales?.length ? (
              <SalesContainer>
               
                <SalesList>
                  {sales.map((sale) => (
                    <SaleItem
                      key={sale.id}
                      sale={sale}
                      onDelete={onDelete}
                      setShouldSearch={setShouldSearch}
                    />
                  ))}
                </SalesList>
              </SalesContainer>
            ) : (
              <Centralizer>
                <Empty description="Nenhuma venda encontrada" />
              </Centralizer>
            )}
          </>
        </>
      ) : (
        <DisconectedForm />
      )} */}
    </Container>
  );
};

export default withRouter(Sale);
