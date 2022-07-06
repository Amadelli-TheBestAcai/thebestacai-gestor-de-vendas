import React, { useState, useEffect } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { currencyFormater } from "../../helpers/currencyFormater";

import SalesHistory from "../../containers/SalesHistory";
import Centralizer from "../../containers/Centralizer";
import NfeForm from "../../containers/NfeForm";
import Spinner from "../../components/Spinner";

import { PaymentType } from "../../models/enums/paymentType";
import { SalesTypes } from "../../models/enums/salesTypes";
import { SaleFromApi } from "../../models/dtos/salesFromApi";

import notHandler from "../../assets/svg/notHandler.svg";
import { Empty, notification, Tooltip, Modal } from "antd";

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
  NfceIcon,
  ModalNFCe,
  Footer,
  ButtonCancel,
  ButtonSave,
  Label,
  NfceLabel,
} from "./styles";

import { useUser } from "../../hooks/useUser";
import { useStore } from "../../hooks/useStore";

type IProps = RouteComponentProps;

const Sale: React.FC<IProps> = () => {
  const { user } = useUser();
  const [shouldSearch, setShouldSearch] = useState(true);
  const [selectedSale, setSelectedSale] = useState<SaleFromApi | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sales, setSales] = useState<SaleFromApi[]>([]);
  const [filteredSale, setFiltered] = useState<SaleFromApi[] | undefined>(
    undefined
  );
  const { hasPermission } = useUser();
  const [nfceModal, setNfceModal] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [emitingNfe, setEmitingNfe] = useState(false);
  const { store } = useStore();

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
        total_sold: _sale.items.length
          ? _sale.items.reduce((total, _item) => total + _item.total, 0)
          : _sale.payments.reduce(
              (total, _payment) => total + _payment.amount,
              0
            ),
      }));

      if (_sales.length) {
        setSelectedSale(payload[0]);
      }
      setSales(payload);
      setIsLoading(false);
      setShouldSearch(false);
    }
    if (shouldSearch) {
      init();
    }
  }, [shouldSearch]);

  const onDelete = (params): void => {
    Modal.confirm({
      content: "Tem certeza que gostaria de remover esta venda",
      okText: "Sim",
      okType: "default",
      cancelText: "Não",
      centered: true,
      async onOk() {
        try {
          setIsLoading(true);

          const success = await window.Main.sale.deleteSaleFromApi(params);
          if (!success) {
            return notification.error({
              message: "Oops! Falha ao remover venda.",
              duration: 5,
            });
          }

          return notification.success({
            message: "Venda removida com sucesso!",
            duration: 5,
          });
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
          setShouldSearch(true);
        }
      },
    });
  };

  const findSale = ({ target: { value } }) => {
    const filteredSale = sales.filter((_sale) =>
      _sale?.id?.toString()?.includes(value)
    );
    setFiltered(filteredSale);
  };

  const openModal = () => {
    if (selectedSale.nfce?.status_sefaz === "100") {
      setModalState(false);
    } else {
      setModalState(true);
    }
  };

  const handleEmit = async () => {
    if (!selectedSale.items.length) {
      return notification.warning({
        message: "Oops! O carrinho está vazio.",
        description: `Selecione algum item para continuar com a emissão da nota.`,
        duration: 5,
      });
    }

    const nfcePayload = {
      cpf: "",
      email: "",
      store_id: store.company_id,
      total: selectedSale.total_sold,
      discount: +selectedSale.discount,
      change_amount: +selectedSale.change_amount,
      items: selectedSale.items.map((product) => ({
        product_store_id: product.product_store_id,
        price_sell: product.total,
        quantity: product.quantity,
      })),
      payments: selectedSale.payments.map((payment) => ({
        amount: payment.amount,
        type: payment.type,
        flag_card:
          payment.type === 1 || payment.type === 2 ? payment.flag_card : null,
      })),
    };

    try {
      setEmitingNfe(true);
      setIsLoading(true);

      console.log(JSON.stringify(nfcePayload));

      const {
        response,
        has_internal_error: errorOnEmitNfce,
        error_message,
      } = await window.Main.sale.emitNfce(nfcePayload, selectedSale.id);

      if (errorOnEmitNfce) {
        return notification.error({
          message: error_message || "Erro ao emitir NFCe",
          duration: 5,
        });
      }

      notification.success({
        message: response,
        duration: 5,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setEmitingNfe(false);
      setModalState(false);
      setIsLoading(false);
      setShouldSearch(true);
    }
  };

  const getNfceDanfe = async (sale_id: number) => {
    const { data } = await axios({
      method: "GET",
      url: `${window.Main.env.API_SALES_HANDLER}/nfce/6412762/danfe`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const { data: blob } = await axios({
      method: "GET",
      responseType: "blob",
      url: `data:html;base64,${data.content}`,
    });

    const blog_url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = blog_url;
    link.setAttribute("download", `${sale_id}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const nfceInfo = () => {
    return {
      authorized: (
        <NfceLabel tab_id={1} style={{ cursor: "pointer" }}>
          Autorizada
        </NfceLabel>
      ),
      resend: <NfceLabel tab_id={2}>Reenviar</NfceLabel>,
    };
  };

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
                  <Input
                    placeholder="Digite a identificação da venda"
                    onChange={findSale}
                  />
                </SearchContainer>
                <ListSaleContainer>
                  <HeaderTable>
                    <Col sm={4}>ID</Col>
                    <Col sm={4}>VALOR</Col>
                    <Col sm={2}>QUANTIDADE</Col>
                    <Col sm={4}>HORA</Col>
                    <Col sm={3}>TIPO</Col>
                    <Col sm={3}>NFC-E</Col>
                    <Col sm={4}>AÇÕES</Col>
                  </HeaderTable>
                  {selectedSale && (
                    <Collapse defaultActiveKey={["1"]} collapsible="disabled">
                      <Panel
                        header={
                          <>
                            <Col sm={4}>{selectedSale.id}</Col>
                            <Col sm={4}>
                              {" "}
                              R$ {currencyFormater(selectedSale?.total_sold)}
                            </Col>
                            <Col sm={2}>{selectedSale.quantity}</Col>
                            <Col sm={4}>
                              {moment(selectedSale.created_at)
                                .add(3, "hours")
                                .format("HH:mm:ss")}
                            </Col>
                            <Col sm={3}>{SalesTypes[selectedSale.type]}</Col>
                            {selectedSale.nfce ? (
                              <Col
                                sm={3}
                                onClick={() =>
                                  selectedSale.nfce?.status_sefaz === "100"
                                    ? getNfceDanfe(selectedSale.id)
                                    : openModal()
                                }
                              >
                                {selectedSale.nfce?.status_sefaz === "100"
                                  ? nfceInfo().authorized
                                  : nfceInfo().resend}
                              </Col>
                            ) : (
                              <Col sm={3} onClick={() => openModal()}>
                                <h4>Não emitida</h4>
                              </Col>
                            )}
                            <Col
                              sm={4}
                              style={{ justifyContent: "space-evenly" }}
                            >
                              {hasPermission("sales.remove_sale") &&
                                !selectedSale.deleted_at && (
                                  <Tooltip title="Remover" placement="bottom">
                                    <RemoveIcon
                                      onClick={() =>
                                        onDelete({
                                          id: selectedSale.id,
                                          cash_history_id:
                                            selectedSale.cash_history_id,
                                          gv_id: selectedSale.gv_id,
                                        })
                                      }
                                    />
                                  </Tooltip>
                                )}
                              {hasPermission("sales.emit_nfce") &&
                                !selectedSale.nfce_focus_id &&
                                selectedSale.type === 0 && (
                                  <Tooltip title="NFc-e" placement="bottom">
                                    <NfceIcon
                                      onClick={() => setNfceModal(true)}
                                    />
                                  </Tooltip>
                                )}
                              <Tooltip title="Imprimir" placement="bottom">
                                <PrinterIcon
                                  onClick={() =>
                                    window.Main.common.printSale(selectedSale)
                                  }
                                />
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
                    filteredSales={filteredSale}
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
      <NfeForm
        setShouldSearch={setShouldSearch}
        modalState={nfceModal}
        setModalState={setNfceModal}
        sale={selectedSale}
      />

      <ModalNFCe
        title="Envio de NFC-e"
        visible={modalState}
        closable={false}
        centered
        width={500}
        footer={
          <Footer>
            <ButtonCancel onClick={() => setModalState(false)}>
              Cancelar
            </ButtonCancel>
            <ButtonSave onClick={() => handleEmit()} loading={isLoading}>
              Enviar novemente
            </ButtonSave>
          </Footer>
        }
      >
        <Label>
          A nota não foi enviada com sucesso na sua última tentativa !
        </Label>
        Para refazer o envio basta selecionar a opção de reenvio.
      </ModalNFCe>
    </Container>
  );
};

export default withRouter(Sale);
