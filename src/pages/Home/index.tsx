import React, { useEffect, useState } from "react";

import Products from "../../containers/Products";
import Balance from "../../containers/Balance";
import Items from "../../containers/Items";
import Payments from "../../containers/Payments";
import Actions from "../../containers/Actions";

import Spinner from "../../components/Spinner";
import Register from "../../components/Register";
import CashNotFound from "../../components/CashNotFound";
import { StoreCashDto } from "../../models/dtos/storeCash";
import { useSale } from "../../hooks/useSale";
import { PaymentDto } from "../../models/dtos/payment";

import { notification, Modal } from "antd";
import { FlagCard } from "../../models/enums/flagCard";
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
} from "./styles";

import { PaymentType } from "../../models/enums/paymentType";
import CupomModal from "../../containers/CupomModal";
import { useSettings } from "../../hooks/useSettings";

const Home: React.FC = () => {
  const { sale, setSale, discountModalHandler, setShouldOpenClientInfo } =
    useSale();
  const { settings } = useSettings();

  const [loading, setLoading] = useState(true);
  const [loadingPayment, setLoadinPayment] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(0);
  const [paymentType, setPaymentType] = useState(0);
  const [flagCard, setFlagCard] = useState<number | null>(99);
  const [cupomModalState, setCupomModalState] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentModalTitle, setPaymentModalTitle] = useState("");
  const [storeCash, setStoreCash] = useState<StoreCashDto | null>(null);

  useEffect(() => {
    async function init() {
      setLoading(true);

      const { response: _sale, has_internal_error: errorOnSale } =
        await window.Main.sale.getCurrentSale();

      if (errorOnSale) {
        notification.error({
          message: "Erro ao obter venda atual",
          duration: 5,
        });
        return;
      }
      const isPaymentTef = _sale.payments.filter(payment => payment.code_nsu)

      if (isPaymentTef.length) {
        console.log('aqui')
        isPaymentTef.forEach((payment, index) => {
          Modal.confirm({
            title: `Você possui ${index + 1} pagamento(s) TEF pendente(s)`,
            content: <><p>O pagamento de valor: R$ {payment.amount.toFixed(2)}</p>
              <p>Bandeira: {FlagCard.find((flag) => flag.id === payment.flag_card)?.value}</p>
              <p>Codigo NSU: {payment.code_nsu}</p>
              <p>Está pendente, você gostaria de desfaze-lo?</p></>,
            okText: "Desfazer Pagamento",
            okType: "default",
            cancelText: "Manter Pagamento",
            centered: true,
            okButtonProps: {
              style: {
                background: "red",
                color: "white",
              },
            },
            async onOk() {
              await removePayment(payment)
            },
          });
        })
      }

      const { response: _storeCash } = await window.Main.storeCash.getCurrent();
      setStoreCash(_storeCash);
      setSale(_sale);
      setLoading(false);
    }
    init();
  }, []);

  const addPayment = async () => {
    setLoadinPayment(true);
    const payment = sale.total_paid + currentPayment;

    if (currentPayment === 0) {
      setLoadinPayment(false);
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
      setLoadinPayment(false);
      return notification.warning({
        message: "Pagamento inválido!",
        description: `Não é possível adicionar um valor de pagamento maior que o valor total da venda.`,
        duration: 5,
      });
    }

    if ((paymentType === 1 || paymentType === 2) && !flagCard) {
      setLoadinPayment(false);
      return notification.warning({
        message: "A bandeira do cartão é obrigatória",
        description: `Selecione uma opção para continuar com o pagamento`,
        duration: 5,
      });
    }

    if (!settings.should_use_tef && flagCard) {
      const {
        response: updatedSale,
        has_internal_error: errorOnAddPayment,
        error_message,
      } = await window.Main.sale.addPayment(
        currentPayment,
        paymentType,
        flagCard
      );
      if (errorOnAddPayment) {
        setLoadinPayment(false);
        return notification.error({
          message: error_message || "Erro ao adicionar pagamento",
          duration: 5,
        });
      }

      setSale(updatedSale);

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
        setLoadinPayment(false);
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
      console.log(updatedSale);
      setCurrentPayment(0);
      setFlagCard(99);
      setPaymentModal(false);
    }
    setLoadinPayment(false);
  };

  const removePayment = async (payment: PaymentDto) => {
    const { response: updatedSale, has_internal_error: errorOnDeletePayment } =
      await window.Main.sale.deletePayment(payment.id);
    if (errorOnDeletePayment) {
      return notification.error({
        message: "Erro ao remover pagamento",
        duration: 5,
      });
    }
    const isPaymentTef = updatedSale?.payments?.some(payment => payment?.code_nsu)

    if (!isPaymentTef) {
      const { has_internal_error: errorOnFinalizeTransaction, error_message } =
        await window.Main.tefFactory.finalizeTransaction([])
      if (errorOnFinalizeTransaction) {
        return notification.error({
          message: error_message || "Erro ao finalizar transação",
          duration: 5,
        });
      }
    }
    setSale(updatedSale);
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
    </Container>
  );
};

export default Home;
