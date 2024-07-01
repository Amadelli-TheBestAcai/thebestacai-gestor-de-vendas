import React, { useEffect, useState } from "react";

import Items from "../../containers/Items";
import Actions from "../../containers/Actions";
import Balance from "../../containers/Balance";
import Products from "../../containers/Products";
import Payments from "../../containers/Payments";
import CupomModal from "../../containers/CupomModal";

import Spinner from "../../components/Spinner";
import Register from "../../components/Register";
import CashNotFound from "../../components/CashNotFound";
import RemoveTefModal from "../../components/RemoveTefModal";

import { useSale } from "../../hooks/useSale";
import { useSettings } from "../../hooks/useSettings";

import { PaymentDto } from "../../models/dtos/payment";
import { FlagCard } from "../../models/enums/flagCard";
import { StoreCashDto } from "../../models/dtos/storeCash";
import { PaymentType } from "../../models/enums/paymentType";
import { PaymentTefCancelType } from "../../models/enums/paymentTefCancelType";

import { notification, Modal, Form } from "antd";
import {
  Container,
  LeftSide,
  RightSide,
  BalanceContainer,
  ItemsContainer,
  TopActions,
  Content,
  ItemsCardContainer,
  PaymentsContainer,
  PaymentsContent,
  RegisterContent,
  GeneralContent,
  RowPaymentTefHeader,
  RowPaymentTef,
  ColPaymentTef,
  Textarea,
} from "./styles";

const DESFEITO = PaymentTefCancelType.DESFEITO;

const Home: React.FC = () => {
  const { sale, setSale, discountModalHandler, setShouldOpenClientInfo } =
    useSale();
  const { settings } = useSettings();
  const [formRemoveTef] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(0);
  const [paymentType, setPaymentType] = useState(0);
  const [flagCard, setFlagCard] = useState<number | null>(99);
  const [cupomModalState, setCupomModalState] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentModalConnect, setPaymentModalConnect] = useState(true);
  const [paymentModalTitle, setPaymentModalTitle] = useState("");
  const [storeCash, setStoreCash] = useState<StoreCashDto | null>(null);
  const [selectTef, setSelectTef] = useState<string>("Sim");

  useEffect(() => {
    async function init() {
      setLoading(true);

      const isConnected = await window.Main.hasInternet();

      const { response: _sale, has_internal_error: errorOnSale } =
        await window.Main.sale.getCurrentSale();

      if (errorOnSale) {
        notification.error({
          message: "Erro ao obter venda atual",
          duration: 5,
        });
        return;
      }
      const isPaymentTef = _sale.payments.filter((payment) => payment.code_nsu);

      if (isPaymentTef.length) {
        isPaymentTef.forEach((payment, index) => {
          Modal.confirm({
            title: `Você possui ${index + 1} pagamento(s) TEF pendente(s)`,
            content: (
              <>
                <p>O seguinte pagamento está pendente:</p>
                <RowPaymentTefHeader>
                  <ColPaymentTef sm={6}>Código NSU</ColPaymentTef>
                  <ColPaymentTef sm={6}>Forma de pagamento</ColPaymentTef>
                  <ColPaymentTef sm={6}>Valor</ColPaymentTef>
                  <ColPaymentTef sm={6}>Bandeira</ColPaymentTef>
                </RowPaymentTefHeader>
                <RowPaymentTef>
                  <ColPaymentTef sm={6}>{payment?.code_nsu}</ColPaymentTef>
                  <ColPaymentTef sm={6}>
                    {PaymentType[payment?.type]}
                  </ColPaymentTef>
                  <ColPaymentTef sm={6}>
                    {payment?.amount?.toFixed(2)?.replace(".", ",")}
                  </ColPaymentTef>
                  <ColPaymentTef sm={6}>
                    {
                      FlagCard?.find((flag) => flag?.id === payment?.flag_card)
                        ?.value
                    }
                  </ColPaymentTef>
                </RowPaymentTef>
                <p style={{ margin: "1rem 0" }}>
                  Caso deseje desfazer este pagamente, é necessário que digite
                  uma justificativa.
                </p>
                <Form form={formRemoveTef}>
                  <Form.Item
                    label=""
                    name="tefRemoveJustify"
                    rules={[
                      { required: true, message: "Campo obrigatório" },
                      {
                        min: 15,
                        message:
                          "A justificativa deve ter no minimo 15 caracteres",
                      },
                      {
                        max: 255,
                        message:
                          "A justificativa deve ter no máximo 255 caracteres",
                      },
                    ]}
                  >
                    <Textarea
                      name="tefRemoveJustify"
                      placeholder="Justificativa - 15 a 255 caracteres"
                      minLength={15}
                      maxLength={255}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Form>
                <p>Gostaria de manter o pagamento ou desfazê-lo?</p>
              </>
            ),
            okText: "Manter Pagamento",
            okType: "default",
            cancelText: "Desfazer Pagamento",
            centered: true,
            okButtonProps: {
              style: {
                background: "green",
                color: "white",
              },
            },
            width: "50%",
            async onCancel() {
              await formRemoveTef.validateFields();
              if (!isConnected) {
                Modal.confirm({
                  title: ` Durante remoção do pagamento, foi constatada a falta de conexão com
                    a internet.`,
                  content: (
                    <>
                      <p>
                        É importante lembrar que após a remoção do pagamento:
                      </p>{" "}
                      <RowPaymentTefHeader>
                        <ColPaymentTef sm={6}>Código NSU</ColPaymentTef>
                        <ColPaymentTef sm={6}>Forma de pagamento</ColPaymentTef>
                        <ColPaymentTef sm={6}>Valor</ColPaymentTef>
                        <ColPaymentTef sm={6}>Bandeira</ColPaymentTef>
                      </RowPaymentTefHeader>
                      <RowPaymentTef>
                        <ColPaymentTef sm={6}>
                          {payment?.code_nsu}
                        </ColPaymentTef>
                        <ColPaymentTef sm={6}>
                          {PaymentType[payment?.type]}
                        </ColPaymentTef>
                        <ColPaymentTef sm={6}>
                          {payment?.amount?.toFixed(2)?.replace(".", ",")}
                        </ColPaymentTef>
                        <ColPaymentTef sm={6}>
                          {
                            FlagCard?.find(
                              (flag) => flag?.id === payment?.flag_card
                            )?.value
                          }
                        </ColPaymentTef>
                      </RowPaymentTef>
                      <p style={{ color: "var(--red-600)" }}>
                        Você deve entrar no <b>CPOSWEB</b> e cancelar o
                        pagamento removido.
                      </p>
                    </>
                  ),
                  okText: "Remover pagamento",
                  okType: "default",
                  centered: true,
                  cancelText: "Manter Pagamento",
                  okButtonProps: {
                    style: {
                      background: "green",
                      color: "white",
                    },
                  },
                  width: "50%",
                  async onOk() {
                    await removePayment(
                      payment,
                      formRemoveTef.getFieldValue("tefRemoveJustify")
                    );
                    await formRemoveTef.resetFields();
                  },
                });
              } else {
                await removePayment(
                  payment,
                  formRemoveTef.getFieldValue("tefRemoveJustify")
                );
                await formRemoveTef.resetFields();
              }
            },
          });
        });
      }

      const { response: _storeCash } = await window.Main.storeCash.getCurrent();
      setStoreCash(_storeCash);
      setSale(_sale);
      setLoading(false);
    }
    init();
  }, []);

  const addPayment = async () => {
    setLoadingPayment(true);
    const payment = sale.total_paid + currentPayment;

    if (currentPayment === 0) {
      setLoadingPayment(false);
      return notification.warning({
        message: "Pagamento inválido!",
        description: `O pagamento não pode ser igual a 0`,
        duration: 5,
      });
    }

    if (
      !currentPayment ||
      (paymentType !== 0 && currentPayment > sale.total_sold - sale.discount) ||
      (paymentType !== 0 && payment > sale.total_sold - sale.discount) ||
      sale.total_paid >= sale.total_sold - sale.discount
    ) {
      setLoadingPayment(false);
      return notification.warning({
        message: "Pagamento inválido!",
        description: `Não é possível adicionar um valor de pagamento maior que o valor total da venda.`,
        duration: 5,
      });
    }

    if ((paymentType === 1 || paymentType === 2) && !flagCard) {
      setLoadingPayment(false);
      return notification.warning({
        message: "A bandeira do cartão é obrigatória",
        description: `Selecione uma opção para continuar com o pagamento`,
        duration: 5,
      });
    }

    let isConnected = await window.Main.hasInternet();

    if (settings.should_use_tef && !isConnected && paymentModalConnect) {
      const showNotification = () => {
        setPaymentModalConnect(false);
        setLoadingPayment(false);
        notification.warning({
          message: "Você não está conectado à internet.",
          description:
            "Devido a isso, não será possível utilizar os serviços da maquininha PIN PAD - TEF. Prossiga com o pagamento utilizando outra maquininha.",
          duration: 10,
        });
      };

      if (
        paymentType !== PaymentType.DINHEIRO &&
        paymentType !== PaymentType.PIX
      ) {
        showNotification();
        return;
      } else if (paymentType === PaymentType.PIX && selectTef === "Sim") {
        showNotification();
        return;
      }
    }

    if (
      (!settings.should_use_tef && flagCard) ||
      !isConnected ||
      (paymentType === PaymentType.PIX && selectTef === "Não")
    ) {
      const turnOffTefPix =
        paymentType === PaymentType.PIX && selectTef === "Não" ? true : false;

      const {
        response: updatedSale,
        has_internal_error: errorOnAddPayment,
        error_message,
      } = await window.Main.sale.addPayment(
        currentPayment,
        paymentType,
        flagCard,
        turnOffTefPix
      );
      if (errorOnAddPayment) {
        setLoadingPayment(false);
        return notification.error({
          message: error_message || "Erro ao adicionar pagamento",
          duration: 5,
        });
      }

      setSale(updatedSale);

      setPaymentModalConnect(true);
      setCurrentPayment(0);
      setFlagCard(99);
      setPaymentModal(false);
    } else {
      const {
        response: updatedSale,
        has_internal_error: errorOnAddPayment,
        error_message,
      } = await window.Main.sale.addPayment(currentPayment, paymentType);
      if (errorOnAddPayment) {
        setLoadingPayment(false);
        return notification.error({
          message: error_message || "Erro ao adicionar pagamento",
          duration: 5,
        });
      }
      const getFlagCardValue = (id) => {
        const flag = FlagCard.find((flag) => flag.id === id);
        return flag ? flag.value : null;
      };

      const lastPayment = updatedSale.payments[updatedSale.payments.length - 1];
      const lastFlagCardValue = getFlagCardValue(lastPayment.flag_card);

      if (lastFlagCardValue) {
        notification.info({
          message: `Bandeira selecionada: ${lastFlagCardValue}`,
          duration: 5,
        });
      }

      setSale(updatedSale);
      setCurrentPayment(0);
      setFlagCard(99);
      setPaymentModal(false);
    }
    setLoadingPayment(false);
  };

  const removePayment = async (payment: PaymentDto, justify?: string) => {
    const deletePayment = async () => {
      setLoadingPayment(true);
      const {
        response: updatedSale,
        has_internal_error: errorOnDeletePayment,
      } = await window.Main.sale.deletePayment(payment.id);
      if (errorOnDeletePayment) {
        setLoadingPayment(false);
        return notification.error({
          message: "Erro ao remover pagamento",
          duration: 5,
        });
      }
      const isConnected = await window.Main.hasInternet();

      const hasTefPaymentInSale = sale?.payments?.some(
        (payment) => payment?.code_nsu
      );

      if (justify) {
        await window.Main.tefFactory.insertPaymentTefAudit(
          payment.type,
          DESFEITO,
          storeCash.history_id,
          justify,
          payment.code_nsu,
          payment.amount?.toFixed(2)?.toString()
        );
      }

      const hasNoTefPaymentInUpdatedSale = updatedSale?.payments?.every(
        (payment) => !payment?.code_nsu
      );

      if (hasTefPaymentInSale && hasNoTefPaymentInUpdatedSale && isConnected) {
        const {
          has_internal_error: errorOnFinalizeTransaction,
          error_message,
        } = await window.Main.tefFactory.finalizeTransaction([]);
        if (errorOnFinalizeTransaction) {
          setLoadingPayment(false);
          return notification.error({
            message: error_message || "Erro ao finalizar transação",
            duration: 5,
          });
        }
      }
      setSale(updatedSale);
      setLoadingPayment(false);
    };

    if (payment.code_nsu) {
      const {
        has_internal_error: errorOnDeletePayment,
        error_message: messageError,
      } = await window.Main.tefFactory.removeTransaction(payment.code_nsu);
      if (errorOnDeletePayment) {
        if (messageError) {
          return notification.error({
            message: messageError,
            duration: 5,
          });
        } else {
          Modal.confirm({
            title: `Ocorreu um erro ao remover pagamento TEF`,
            content: (
              <>
                <p>O pagamento:</p>{" "}
                <RowPaymentTefHeader>
                  <ColPaymentTef sm={6}>Código NSU</ColPaymentTef>
                  <ColPaymentTef sm={6}>Forma de pagamento</ColPaymentTef>
                  <ColPaymentTef sm={6}>Valor</ColPaymentTef>
                  <ColPaymentTef sm={6}>Bandeira</ColPaymentTef>
                </RowPaymentTefHeader>
                <RowPaymentTef>
                  <ColPaymentTef sm={6}>{payment?.code_nsu}</ColPaymentTef>
                  <ColPaymentTef sm={6}>
                    {PaymentType[payment?.type]}
                  </ColPaymentTef>
                  <ColPaymentTef sm={6}>
                    {payment?.amount?.toFixed(2)?.replace(".", ",")}
                  </ColPaymentTef>
                  <ColPaymentTef sm={6}>
                    {
                      FlagCard?.find((flag) => flag?.id === payment?.flag_card)
                        ?.value
                    }
                  </ColPaymentTef>
                </RowPaymentTef>
                <p style={{ color: "var(--red-600)" }}>
                  Devido a isso ao clicar em "Remover Pagamento" você deve entrar no <b>CPOSWEB</b> e
                  cancelar o pagamento removido.
                </p>
              </>
            ),
            okText: "Remover Pagamento",
            okType: "default",
            cancelText: "Manter Pagamento",
            centered: true,
            okButtonProps: {
              style: {
                background: "green",
                color: "white",
              },
            },

            width: "50%",
            async onOk() {
              await deletePayment();
              return;
            },
          });
        }
      } else {
        await deletePayment();
      }
    } else {
      await deletePayment();
    }
  };

  const handleOpenPayment = (
    type: number,
    title: string,
    flagCard = 99
  ): void => {
    setPaymentType(type);
    setFlagCard(flagCard);
    setPaymentModal(true);
    setPaymentModalTitle(title);
  };

  const sendFocusToBalance = () => {
    document.getElementById("balanceInput")?.focus();
  };

  const keyMap = {
    money: "a",
    MONEY: "A",
    c_credit: "s",
    C_CREDIT: "S",
    c_debit: "d",
    C_DEBIT: "D",
    ticket: "t",
    TICKET: "T",
    pix: "p",
    PIX: "P",
    REGISTER: "f1",
    focus_balance: "b",
    FOCUS_BALANCE: "B",
    insert_discount: "r",
    INSERT_DISCOUNT: "R",
    insert_cupom: "c",
    INSERT_CUPOM: "C",
    insert_cpf: "i",
    INSERT_CPF: "I",
  };

  const handlers = {
    money: () => handleOpenPayment(PaymentType.DINHEIRO, "Dinheiro"),
    MONEY: () => handleOpenPayment(PaymentType.DINHEIRO, "Dinheiro"),
    c_credit: () =>
      handleOpenPayment(PaymentType.CREDITO, "C. Crédito", flagCard),
    C_CREDIT: () =>
      handleOpenPayment(PaymentType.CREDITO, "C. Crédito", flagCard),
    c_debit: () => handleOpenPayment(PaymentType.DEBITO, "C. Débito", flagCard),
    C_DEBIT: () => handleOpenPayment(PaymentType.DEBITO, "C. Débito", flagCard),
    ticket: () => handleOpenPayment(PaymentType.TICKET, "Ticket"),
    TICKET: () => handleOpenPayment(PaymentType.TICKET, "Ticket"),
    pix: () => handleOpenPayment(PaymentType.PIX, "PIX"),
    PIX: () => handleOpenPayment(PaymentType.PIX, "PIX"),
    focus_balance: () => sendFocusToBalance(),
    FOCUS_BALANCE: () => sendFocusToBalance(),
    insert_discount: () => discountModalHandler.openDiscoundModal(),
    INSERT_DISCOUNT: () => discountModalHandler.openDiscoundModal(),
    insert_cupom: () => setCupomModalState(true),
    INSERT_CUPOM: () => setCupomModalState(true),
    insert_cpf: () => setShouldOpenClientInfo(true),
    INSERT_CPF: () => setShouldOpenClientInfo(true),
  };

  return (
    <Container
      id="mainContainer"
      handlers={handlers}
      keyMap={keyMap}
      allowChanges={true}
    >
      <>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {storeCash?.is_opened ? (
              <>
                <TopActions>
                  <Actions />
                </TopActions>

                <GeneralContent>
                  <LeftSide>
                    <BalanceContainer>
                      <Balance
                        handleOpenPayment={handleOpenPayment}
                        openDiscoundModal={
                          discountModalHandler.openDiscoundModal
                        }
                      />
                    </BalanceContainer>

                    <ItemsContainer>
                      <Products />
                    </ItemsContainer>
                  </LeftSide>

                  <RightSide>
                    <Content>
                      <ItemsCardContainer>
                        <Items />
                      </ItemsCardContainer>

                      <PaymentsContainer>
                        <PaymentsContent>
                          <Payments
                            sale={sale}
                            addPayment={addPayment}
                            removePayment={removePayment}
                            setCurrentPayment={setCurrentPayment}
                            modalState={paymentModal}
                            modalTitle={paymentModalTitle}
                            setModalState={setPaymentModal}
                            handleOpenPayment={handleOpenPayment}
                            shouldViewValues={true}
                            shouldDisableButtons={true}
                            flagCard={flagCard}
                            setFlagCard={setFlagCard}
                            loadingPayment={loadingPayment}
                            setLoadingPayment={setLoadingPayment}
                            paymentModalConnect={paymentModalConnect}
                            selectTef={selectTef}
                            setSelectTef={setSelectTef}
                          />
                        </PaymentsContent>
                        <CupomModal
                          cupomModalState={cupomModalState}
                          setCupomModalState={setCupomModalState}
                        />
                        <RegisterContent>
                          <Register />
                        </RegisterContent>
                      </PaymentsContainer>
                    </Content>
                  </RightSide>
                </GeneralContent>
              </>
            ) : (
              <CashNotFound description="Nenhum caixa aberto no momento. Abra o caixa para iniciar as vendas." />
            )}
          </>
        )}
      </>
      <RemoveTefModal />
    </Container>
  );
};

export default Home;
