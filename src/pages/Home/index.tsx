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

import { message } from "antd";
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

const Home: React.FC = () => {
  const {
    sale,
    setSale,
    loadingSale,
    onRegisterSale,
    discountModalHandler,
    onAddItem,
  } = useSale();
  const [loading, setLoading] = useState(true);
  const [currentPayment, setCurrentPayment] = useState(0);
  const [paymentType, setPaymentType] = useState(0);
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentModalTitle, setPaymentModalTitle] = useState("");
  const [storeCash, setStoreCash] = useState<StoreCashDto | null>(null);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const _sale = await window.Main.sale.getCurrent();
      const _storeCash = await window.Main.storeCash.getCurrent();
      setStoreCash(_storeCash);
      setSale(_sale);
      setLoading(false);
    }
    init();
  }, []);

  const addPayment = async () => {
    if (!currentPayment) {
      return message.warning("Pagamento inválido");
    }
    const updatedSale = await window.Main.sale.addPayment(
      currentPayment,
      paymentType
    );
    setSale(updatedSale);

    setCurrentPayment(0);
    setPaymentModal(false);
  };

  const removePayment = async (id: string) => {
    const updatedSale = await window.Main.sale.deletePayment(id);
    setSale(updatedSale);
  };

  const handleOpenPayment = (type: number, title: string): void => {
    setPaymentType(type);
    setPaymentModal(true);
    setPaymentModalTitle(title);
  };

  const sendFocusToBalance = () => {
    document.getElementById("balanceInput").focus();
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
  };

  const handlers = {
    money: () => handleOpenPayment(PaymentType.DINHEIRO, "Dinheiro"),
    MONEY: () => handleOpenPayment(PaymentType.DINHEIRO, "Dinheiro"),
    c_credit: () => handleOpenPayment(PaymentType.CREDITO, "Crédito"),
    C_CREDIT: () => handleOpenPayment(PaymentType.CREDITO, "Crédito"),
    c_debit: () => handleOpenPayment(PaymentType.DEBITO, "Débito"),
    C_DEBIT: () => handleOpenPayment(PaymentType.DEBITO, "Débito"),
    ticket: () => handleOpenPayment(PaymentType.TICKET, "Ticket"),
    TICKET: () => handleOpenPayment(PaymentType.TICKET, "Ticket"),
    pix: () => handleOpenPayment(PaymentType.PIX, "PIX"),
    PIX: () => handleOpenPayment(PaymentType.PIX, "PIX"),
    REGISTER: () => onRegisterSale(),
    focus_balance: () => sendFocusToBalance(),
    FOCUS_BALANCE: () => sendFocusToBalance(),
    insert_discount: () => discountModalHandler.openDiscoundModal(),
    INSERT_DISCOUNT: () => discountModalHandler.openDiscoundModal(),
  };

  return (
    <Container
      id="mainContainer"
      handlers={handlers}
      keyMap={keyMap}
      allowChanges={true}
    >
      <LeftSide>
        <BalanceContainer>
          <Balance
            addItem={onAddItem}
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
              />
            </PaymentsContent>

            <RegisterContent>
              <Register />
            </RegisterContent>
          </PaymentsContainer>
        </Content>
      </RightSide>
    </Container>
  );
};

export default Home;
