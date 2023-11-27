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
  Textarea,
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
  PdfIcon,
  CancelIcon,
} from "./styles";

import { useUser } from "../../hooks/useUser";
import { useStore } from "../../hooks/useStore";

type IProps = RouteComponentProps;

const Sale: React.FC<IProps> = () => {
  const { user } = useUser();
  const [shouldSearch, setShouldSearch] = useState(true);
  const [nfceCancelJustify, setNfceCancelJustify] = useState("");
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


  const onDelete = async (sale) => {
    Modal.confirm({
      title: "Tem certeza que gostaria de remover esta venda?",
      content: (
        <Textarea
          id="nfceDeleteJustifyInput"
          placeholder="Justificativa - 15 a 255 caracteres"
          minLength={15}
          maxLength={255}
          style={{ width: "100%" }}
          onChange={({ target: { value } }) => setNfceCancelJustify(value || "")}
        />
      ),
      okText: "Sim",
      okType: "default",
      cancelText: "Não",
      centered: true,
      onOk: async () => {
        //@ts-ignore
        const justify = document.getElementById('nfceDeleteJustifyInput')?.value;
        if (!justify || justify.length < 15 || justify.length > 255) {
          return notification.warning({
            message: "Justificativa deve ter entre 15 e 255 caracteres",
            duration: 5,
          });
        }

        try {
          setIsLoading(true);
          const { has_internal_error } = await window.Main.sale.cancelNfce(sale.id, justify);

          if (has_internal_error) {
            return notification.warning({
              message: "NFC-e autorizada ha mais de 30 minutos",
              duration: 5,
            });
          }

          const success = await window.Main.sale.deleteSaleFromApi(sale.id);

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
          notification.error({
            message: "Erro ao tentar remover a venda. Por favor, tente novamente.",
            duration: 5,
          });
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
      ref: selectedSale.ref,
    };

    try {
      setEmitingNfe(true);
      setIsLoading(true);

      const {
        response,
        has_internal_error: errorOnEmitNfce,
        error_message,
      } = await window.Main.sale.emitNfce(nfcePayload, selectedSale.id);
      if (errorOnEmitNfce) {
        if (error_message === "Store token not found.") {
          notification.error({
            message: "O token da nota fiscal não está cadastrado na loja.",
            duration: 5,
          });
          return;
        }
        return notification.error({
          message: error_message || "Erro ao emitir NFCe",
          duration: 5,
        });
      }
      return notification.success({
        message: response?.mensagem_sefaz,
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

  const cancelNfce = async (sale: SaleFromApi) => {
    Modal.confirm({
      title: "Deseja prosseguir e cancelar esta nota fiscal?",
      content: (
        <Textarea
          id="nfceJustifyInput"
          placeholder="Justificativa - 15 a 255 caracteres"
          minLength={15}
          maxLength={255}
          style={{ width: "100%" }}
          onChange={({ target: { value } }) =>
            setNfceCancelJustify(value || "")
          }
        />
      ),
      async onOk() {
        //@ts-ignore
        const justify = document.getElementById("nfceJustifyInput")?.value;

        if (justify.length < 15 || justify.length > 255) {
          notification.warning({
            message: "Justificativa deve ter entre 15 e 255 caracteres",
            duration: 5,
          });
          return;
        }
        const { error_message, has_internal_error: errorOnCancelNfce } =
          await window.Main.sale.cancelNfce(sale.id, justify || "");
        if (errorOnCancelNfce) {
          notification.warning({
            message: error_message,
            duration: 5,
          });
          return;
        }
        notification.success({
          message: "Nota fiscal cancelada com sucesso",
          duration: 5,
        });
        setShouldSearch(true);
      },
    });
  };

  const printDanfe = async (sale: SaleFromApi) => {
    const { data } = await axios({
      method: "GET",
      url: `${window.Main.env.API_SALES_HANDLER}/nfce/${sale.id}/danfe`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const html = Buffer.from(data.content, "base64").toString("utf-8");

    const reaplaceQrcode = async (_html) => {
      const [beforeQrcodeDiv, afterQrcodeDiv] = _html.split(
        `<div id='qr-code0'></div>`
      );
      const qrcodeurl = _html.split("http")[1].split(`"`)[0];

      async function getBase64(url) {
        const response = await axios.get(url, {
          responseType: "arraybuffer",
        });
        return Buffer.from(response.data, "binary").toString("base64");
      }

      const qrcode64 = await getBase64(
        `https://api.qrserver.com/v1/create-qr-code/?data=${qrcodeurl}`
      );
      let response =
        beforeQrcodeDiv +
        `<img id='barcode'
          src="data:image/jpeg;base64,${qrcode64}"
          alt="nfce-qrcode" 
          title="qrcode" 
          width="200" 
          height="200" />` +
        afterQrcodeDiv;

      const [beforeScriptDiv, afterScriptDiv] = _html.split(
        `<script type="text/javascript">`
      );

      const printFunction = `\nfunction step1(){setTimeout('step2()', 10);} \n function step2() {window.print()}`;
      response =
        beforeScriptDiv +
        `<script type="text/javascript"> \n` +
        printFunction +
        afterScriptDiv;

      const [beforeBodyTag, afterBodyTag] = response.split(`<body>`);

      response = beforeBodyTag + `<body onload='step1()'>` + afterBodyTag;

      return response;
    };

    const formatedHtml = await reaplaceQrcode(html);
    var Pagelink = "about:blank";
    var pwa = window.open(Pagelink, "_new");
    pwa.document.open();
    pwa.document.write(formatedHtml);
    pwa.document.close();
  };

  const getNfceDanfe = async (sale: SaleFromApi) => {
    const { data } = await axios({
      method: "GET",
      url: `${window.Main.env.API_SALES_HANDLER}/nfce/${sale.id}/danfe`,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const { data: blob } = await axios({
      method: "GET",
      responseType: "blob",
      url: `data:pdf;base64,${data.content}`,
    });

    const blog_url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = blog_url;
    link.setAttribute("download", `${sale.id}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printReceipt = async (sale: SaleFromApi) => {
    const { response: _settings, has_internal_error: errorOnSettings } =
      await window.Main.settings.getSettings();
    if (errorOnSettings) {
      return notification.error({
        message: "Erro ao encontrar configurações",
        duration: 5,
      });
    }

    if (_settings.should_use_printer === false) {
      return notification.warning({
        message: "Habilite a impressora na tela de configurações.",
        duration: 5,
      });
    }

    const { response: _printSale, has_internal_error: errorOPrintSale } =
      await window.Main.common.printSale(sale);

    // @ts-ignore
    if (!_printSale) {
      return notification.warning({
        message: "Não foi possível concluir a impressão da venda.",
        description: "Por favor, verifique a conexão da sua impressora.",
        duration: 5,
      });
    }

    if (errorOPrintSale) {
      return notification.error({
        message: "Erro ao tentar imprimir",
        duration: 5,
      });
    }
  };

  const nfceInfo = (selectedSale: SaleFromApi) => {
    return {
      authorized: (
        <>
          <Col sm={8}>
            <Tooltip title="Imprimir Danfe" placement="bottom">
              <PrinterIcon
                style={{ width: "30%" }}
                onClick={() => printDanfe(selectedSale)}
              />
            </Tooltip>
          </Col>
          <Col sm={8}>
            <Tooltip title="Cancelar NFCe" placement="bottom">
              <CancelIcon
                style={{ width: "30%" }}
                onClick={() => cancelNfce(selectedSale)}
              />
            </Tooltip>
          </Col>
          <Col sm={8}>
            <Tooltip title="Baixar PDF" placement="bottom">
              <PdfIcon
                style={{ width: "30%" }}
                onClick={() => getNfceDanfe(selectedSale)}
              />
            </Tooltip>
          </Col>
        </>
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
                                    ? null
                                    : openModal()
                                }
                              >
                                {selectedSale.nfce?.status_sefaz === "100"
                                  ? nfceInfo(selectedSale).authorized
                                  : nfceInfo(selectedSale).resend}
                              </Col>
                            ) : (
                              <Col sm={3} onClick={() => openModal()}>
                                <h4 className="buttonText">Emitir NFC-e</h4>
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
                                      onClick={() => {
                                        onDelete({
                                          id: selectedSale.id,
                                          cash_history_id:
                                            selectedSale.cash_history_id,
                                          gv_id: selectedSale.gv_id,
                                        });
                                      }}
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
                              <Tooltip
                                title="Imprimir Cupom fiscal"
                                placement="bottom"
                              >
                                <PrinterIcon
                                  onClick={() => printReceipt(selectedSale)}
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
                    selectedSale={selectedSale}
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
              Enviar novamente
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
