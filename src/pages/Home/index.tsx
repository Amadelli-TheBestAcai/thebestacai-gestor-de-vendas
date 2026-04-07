import React, { useEffect, useRef, useState } from "react";

import Items from "../../containers/Items";
import Actions from "../../containers/Actions";
import Balance from "../../containers/Balance";
import Products from "../../containers/Products";
import Payments from "../../containers/Payments";
import CupomModal from "../../containers/CupomModal";
import Centralizer from "../../containers/Centralizer";

import Spinner from "../../components/Spinner";
import Register from "../../components/Register";
import CashNotFound from "../../components/CashNotFound";

import { useSale } from "../../hooks/useSale";
import { useSettings } from "../../hooks/useSettings";

import { PaymentDto } from "../../models/dtos/payment";
import { FlagCard } from "../../models/enums/flagCard";
import { StoreCashDto } from "../../models/dtos/storeCash";
import { PaymentType } from "../../models/enums/paymentType";

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

const Home: React.FC = () => {
  const {
    sale,
    setSale,
    discountModalHandler,
    setShouldOpenClientInfo,
    onRegisterSale,
  } = useSale();
  const { settings, setSettings } = useSettings();
  const [formRemoveTef] = Form.useForm();
  
  const [loading, setLoading] = useState(true);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [loadingPaymentModalOpenOnline, setLoadingPaymentModalOpenOnline] =
    useState(false);
  const [currentPayment, setCurrentPayment] = useState(0);
  const [paymentType, setPaymentType] = useState(0);
  const [flagCard, setFlagCard] = useState<number | null>(99);
  const [cupomModalState, setCupomModalState] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentModalConnect, setPaymentModalConnect] = useState(true);
  const [paymentModalTitle, setPaymentModalTitle] = useState("");
  const [storeCash, setStoreCash] = useState<StoreCashDto | null>(null);
  const [selectTef, setSelectTef] = useState<string>("Sim");
  const [shouldCheckAutoFinalize, setShouldCheckAutoFinalize] = useState(false);
  const autoFinalizeInProgressRef = useRef(false);

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
    

      const { response: _storeCash } = await window.Main.storeCash.getCurrent();
      setStoreCash(_storeCash);
      setSale(_sale);
      setLoading(false);
    }
    init();
  }, []);

  useEffect(() => {
    if (
      !shouldCheckAutoFinalize ||
      !sale ||
      autoFinalizeInProgressRef.current
    ) {
      return;
    }

    const hasTefPayment = sale?.payments?.some((payment) => !!payment?.code_nsu);
    if (!hasTefPayment) {
      setShouldCheckAutoFinalize(false);
      return;
    }

    const expectedTotal = +(
      sale?.total_sold -
      sale?.discount -
      (sale?.customer_nps_reward_discount || 0)
    ).toFixed(2);
    const totalPaid = +(sale?.total_paid || 0).toFixed(2);
    const shouldFinalize = totalPaid === expectedTotal;

    if (!shouldFinalize) {
      setShouldCheckAutoFinalize(false);
      return;
    }

    autoFinalizeInProgressRef.current = true;
    onRegisterSale().finally(() => {
      autoFinalizeInProgressRef.current = false;
      setShouldCheckAutoFinalize(false);
    });
  }, [onRegisterSale, sale, shouldCheckAutoFinalize]);

  const addPayment = async () => {
    if (loadingPayment) return;
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

    const isManualPaymentFlow =
      (!settings.should_use_tef && flagCard) ||
      !isConnected ||
      !paymentModalConnect ||
      (paymentType === PaymentType.PIX && selectTef === "Não") ||
      (settings.should_use_tef &&
        selectTef === "Sim" &&
        paymentType === PaymentType.PIX &&
        !settings.cnpj_credenciadora);

    if (isManualPaymentFlow) {
      const turnOffTef =
        (settings.should_use_tef &&
          selectTef === "Sim" &&
          !settings.cnpj_credenciadora) ||
        (paymentType === PaymentType.PIX && selectTef === "Não") ||
        !paymentModalConnect
          ? true
          : false;

      const {
        response: updatedSale,
        has_internal_error: errorOnAddPayment,
        error_message,
      } = await window.Main.sale.addPayment(
        currentPayment,
        paymentType,
        (paymentType === PaymentType.TICKET && settings.should_use_tef) ||
          paymentType === PaymentType.CREDITO ||
          paymentType === PaymentType.DEBITO
          ? flagCard
          : null,
        turnOffTef
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
      setShouldCheckAutoFinalize(true);
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
      setShouldCheckAutoFinalize(true);
    }
    setLoadingPayment(false);
  };

  const removePaymentFromSale = async (payment: PaymentDto) => {
    const { response: updatedSale, has_internal_error: errorOnDeletePayment } =
      await window.Main.sale.deletePayment(payment.id);

    return {
      updatedSale: updatedSale,
      has_error_payment: errorOnDeletePayment,
    };
  };

  const removePayment = async (payment: PaymentDto) => {
      setLoadingPayment(true);
      let _updatedSale;

      const { updatedSale, has_error_payment } = await removePaymentFromSale(
        payment
        );
        _updatedSale = updatedSale;
        if (has_error_payment) {
          setLoadingPayment(false);
          return notification.error({
            message: "Erro ao remover pagamento",
            duration: 5,
          });
        }
    

      setSale(_updatedSale);
      setLoadingPayment(false);

   
  };

  const openOnlineStoreCash = async () => {
    if (settings.should_open_casher === false) {
      const { response: updatedSettings, has_internal_error } =
        await window.Main.settings.update(settings.id, {
          ...settings,
          should_open_casher: true,
        });

      if (has_internal_error) {
        notification.error({
          message: "Erro ao atualizar as configurações",
          duration: 5,
        });
        return false;
      }

      setSettings(updatedSettings);
    }

    const { has_internal_error, error_message, response } =
      await window.Main.storeCash.openOnlineStoreCash();

    if (has_internal_error) {
      if (
        error_message !==
        "Sem conexão com a internet. Por favor, verifique sua conexão."
      ) {
        error_message
          ? notification.warning({
              message: error_message,
              duration: 5,
            })
          : notification.error({
              message: "Erro ao abrir caixa",
              duration: 5,
            });
      }
      return false;
    }
    setStoreCash(response);

    notification.success({
      message: "Caixa online aberto com sucesso",
      duration: 5,
    });

    const {
      has_internal_error: internalErrorOnOnlineIntegrate,
      error_message: errorMessageOnOnlineTntegrate,
    } = await window.Main.sale.onlineIntegration();

    if (internalErrorOnOnlineIntegrate) {
      errorMessageOnOnlineTntegrate
        ? notification.warning({
            message: errorMessageOnOnlineTntegrate,
            duration: 5,
          })
        : notification.error({
            message:
              errorMessageOnOnlineTntegrate || "Erro ao integrar venda online",
            duration: 5,
          });
    }

    const {
      has_internal_error: errorOnIntegrateHandler,
      error_message: errorMessageOnIntegrateHandler,
    } = await window.Main.handler.integrateHandler();

    if (errorOnIntegrateHandler) {
      errorMessageOnIntegrateHandler
        ? notification.warning({
            message: errorMessageOnIntegrateHandler,
            duration: 5,
          })
        : notification.error({
            message:
              errorMessageOnIntegrateHandler || "Erro ao integrar movimentação",
            duration: 5,
          });
    }

    const {
      has_internal_error: errorOnIntegrateItemOutCart,
      error_message: errorMessageOnIntegrateItemOutCart,
    } = await window.Main.itemOutCart.integrationItemOutCart();

    if (errorOnIntegrateItemOutCart) {
      errorMessageOnIntegrateItemOutCart
        ? notification.warning({
            message: errorMessageOnIntegrateItemOutCart,
            duration: 5,
          })
        : notification.error({
            message:
              errorMessageOnIntegrateItemOutCart ||
              "Erro ao integrar itens fora do carrinho",
            duration: 5,
          });
    }
    return true;
  };

  const handleOpenPayment = async (
    type: number,
    title: string,
    flagCard = 99
  ) => {
    if (!storeCash.is_online && settings.should_use_tef) {
      setLoadingPaymentModalOpenOnline(true);
      const openStoreCash = await openOnlineStoreCash();
      if (!openStoreCash) {
        notification.error({
          message: "Não foi possível realizar a abertura do caixa online",
          description:
            "Devido a isso, não será possível utilizar os serviços da maquininha PIN PAD - TEF. Prossiga com o pagamento utilizando outra maquininha.",
          duration: 10,
        });
        setPaymentModalConnect(false);
      } else {
        setPaymentModalConnect(true);
      }
    }
    if (
      settings.should_use_tef &&
      selectTef === "Sim" &&
      !settings.cnpj_credenciadora &&
      type === PaymentType.PIX
    ) {
      Modal.confirm({
        title:
          "Para realizar uma venda por PIX via TEF, é necessário informar o CNPJ da credenciadora do PIX na tela de configuração",
        content:
          "Ao prosseguir, você concorda em continuar com o pagamento sem a utilização de TEF",
        okText: "Prosseguir sem TEF",
        okType: "default",
        cancelText: "Cancelar",
        centered: true,
        onOk() {
          notification.info({
            message: "Continuar com o pagamento sem tef",
            duration: 5,
          });
          setLoadingPaymentModalOpenOnline(false);
          setPaymentType(type);
          setFlagCard(flagCard);
          setPaymentModal(true);
          setPaymentModalTitle(title);
        },
        onCancel() {
          notification.info({
            message:
              "Acesse a tela de configurações para selecionar o cnpj da credenciadora",
            duration: 5,
          });
          return;
        },
      });
    } else {
      setLoadingPaymentModalOpenOnline(false);
      setPaymentType(type);
      setFlagCard(flagCard);
      setPaymentModal(true);
      setPaymentModalTitle(title);
    }
  };

  const sendFocusToBalance = () => {
    document.getElementById("balanceInput")?.focus();
  };

  const canOpenCupomModal = () => {
    const totalPaid = sale?.payments?.reduce(
      (total, payment) => total + payment.amount,
      0
    );
    if (totalPaid > 0) {
      return;
    }
    setCupomModalState(true);
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
    insert_cupom: () => canOpenCupomModal(),
    INSERT_CUPOM: () => canOpenCupomModal(),
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
      <Modal
        visible={loadingPaymentModalOpenOnline}
        footer={false}
        title={false}
        closable={false}
      >
        <Centralizer>
          <h2>Abrindo caixa online</h2>
          <Spinner />
          <h3>Aguarde alguns instantes</h3>
        </Centralizer>
      </Modal>
    </Container>
  );
};

export default Home;
