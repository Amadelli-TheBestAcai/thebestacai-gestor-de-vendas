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

import { notification } from "antd";
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
} from "./styles";

import { PaymentType } from "../../models/enums/paymentType";
import CupomModal from "../../containers/CupomModal";

const Home: React.FC = () => {
  const { sale, setSale, setShouldOpenClientInfo, discountModalHandler } =
    useSale();
  const [loading, setLoading] = useState(true);
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

      const { response: _storeCash } = await window.Main.storeCash.getCurrent();
      setStoreCash(_storeCash);
      setSale(_sale);
      setLoading(false);
    }
    init();
  }, []);

  const addPayment = async () => {
    const payment = sale.total_paid + currentPayment;
    if (
      !currentPayment ||
      (paymentType !== 0 && currentPayment > sale.total_sold - sale.discount) ||
      (paymentType !== 0 && payment > sale.total_sold - sale.discount) ||
      sale.total_paid >= sale.total_sold - sale.discount
    ) {
      return notification.warning({
        message: "Pagamento inválido!",
        description: `Não é possível adicionar um valor de pagamento maior que o valor total da venda.`,
        duration: 5,
      });
    }

    if ((paymentType === 1 || paymentType === 2) && !flagCard) {
      return notification.warning({
        message: "A bandeira do cartão é obrigatória",
        description: `Selecione uma opção para continuar com o pagamento`,
        duration: 5,
      });
    }

    if (flagCard) {
      const { response: updatedSale, has_internal_error: errorOnAddPayment } =
        await window.Main.sale.addPayment(
          currentPayment,
          paymentType,
          flagCard
        );
      if (errorOnAddPayment) {
        return notification.error({
          message: "Erro ao adicionar pagamento",
          duration: 5,
        });
      }
      setSale(updatedSale);

      setCurrentPayment(0);
      setFlagCard(99);
      setPaymentModal(false);
    } else {
      const { response: updatedSale, has_internal_error: errorOnAddPayment } =
        await window.Main.sale.addPayment(currentPayment, paymentType);
      if (errorOnAddPayment) {
        return notification.error({
          message: "Erro ao adicionar pagamento",
          duration: 5,
        });
      }
      setSale(updatedSale);

      setCurrentPayment(0);
      setFlagCard(99);
      setPaymentModal(false);
    }
  };

  const removePayment = async (id: string) => {
    const { response: updatedSale, has_internal_error: errorOnDeletePayment } =
      await window.Main.sale.deletePayment(id);
    if (errorOnDeletePayment) {
      return notification.error({
        message: "Erro ao remover pagamento",
        duration: 5,
      });
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
    REGISTER: () => setShouldOpenClientInfo(true),
    focus_balance: () => sendFocusToBalance(),
    FOCUS_BALANCE: () => sendFocusToBalance(),
    insert_discount: () => discountModalHandler.openDiscoundModal(),
    INSERT_DISCOUNT: () => discountModalHandler.openDiscoundModal(),
    insert_cupom: () => setCupomModalState(true),
    INSERT_CUPOM: () => setCupomModalState(true),
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
                <LeftSide>
                  <BalanceContainer>
                    <Balance
                      handleOpenPayment={handleOpenPayment}
                      openDiscoundModal={discountModalHandler.openDiscoundModal}
                    />
                  </BalanceContainer>

                  <ItemsContainer>
                    <Products />
                  </ItemsContainer>
                </LeftSide>

                <RightSide>
                  <TopActions>
                    <Actions />
                  </TopActions>
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
