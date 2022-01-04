import React, { Dispatch, SetStateAction, useEffect } from "react";

import { PaymentType } from "../../models/enums/paymentType";
import { SaleDto } from "../../models/dtos/sale";

import Payment from "../../components/Payment";

import PixLogo from "../../assets/svg/pix.svg";

import {
  Container,
  TypesPaymentsContainer,
  Button,
  MoneyIcon,
  CreditIcon,
  DebitIcon,
  TicketIcon,
  PixIcon,
  PaymentsInfoContainer,
  ValuesContainer,
  Input,
  Modal,
  ValueInfo,
} from "./styles";

interface IProps {
  sale: SaleDto;
  removePayment: (id: string) => Promise<void>;
  addPayment: () => Promise<void>;
  handleOpenPayment: (type: number, title: string) => void;
  setCurrentPayment: Dispatch<SetStateAction<number>>;
  setModalState: Dispatch<SetStateAction<boolean>>;
  modalState: boolean;
  modalTitle: string;
}

const PaymentsContainer: React.FC<IProps> = ({
  sale,
  removePayment,
  addPayment,
  setModalState,
  modalState,
  handleOpenPayment,
  setCurrentPayment,
  modalTitle,
}) => {
  const onModalCancel = (): void => {
    setModalState(false);
  };

  const getAmount = (amount: number): void => {
    setCurrentPayment(amount);
  };

  const buttonsPaymentsStyle = [
    {
      icon: <MoneyIcon />,
      label: "Dinheiro [A}",
      background: "var(--green-400)",
      action: `${console.log("teste")}`,
    },
    {
      icon: <CreditIcon />,
      label: "Crédito [S]",
      background: "var(--blue-300)",
      action: "",
    },
    {
      icon: <DebitIcon />,
      label: "Débito [D]",
      background: "var(--blue-400)",
      action: "",
    },
    {
      icon: <TicketIcon />,
      label: "Ticket",
      background: "var(--purple-450)",
      action: "",
    },
    {
      icon: <PixIcon src={PixLogo} />,
      label: "Pix [P]",
      background: "var(--teal-400)",
      action: "",
    },
  ];

  return (
    <Container>
      <TypesPaymentsContainer>
        {buttonsPaymentsStyle.map((buttonStyle) => (
          <Button
            style={{ background: buttonStyle.background }}
            onClick={() => handleOpenPayment(PaymentType.DINHEIRO, "Dinheiro")}
          >
            {buttonStyle.icon} {buttonStyle.label}
          </Button>
        ))}
      </TypesPaymentsContainer>

      <PaymentsInfoContainer>
        {sale.payments?.map((payment, index) => (
          <Payment
            key={index}
            payment={payment}
            removePayment={removePayment}
          />
        ))}
      </PaymentsInfoContainer>

      <ValuesContainer>
        <ValueInfo>
          R$ Troco <br />{" "}
          <strong style={{ color: "var(--red-600" }}>
            {sale.change_amount.toFixed(2).replace(".", ",")}
          </strong>
        </ValueInfo>
        <ValueInfo>
          R$ Valor Pago <br />{" "}
          <strong style={{ color: "var(--green-600" }}>
            {sale.total_paid.toFixed(2).replace(".", ",")}
          </strong>
        </ValueInfo>
        <ValueInfo>
          Quantidade Itens <br />{" "}
          <strong style={{ color: "var(--grey-80" }}>
            {sale.quantity || 0}
          </strong>
        </ValueInfo>
      </ValuesContainer>
      {/* <Header>
        <Button
          className="ant-btn"
          onClick={() => handleOpenPayment(PaymentType.DINHEIRO, "Dinheiro")}
        >
          [A] DINHEIRO
          <MoneyIcon />
        </Button>
        <Button
          className="ant-btn"
          onClick={() => handleOpenPayment(PaymentType.CREDITO, "Crédito")}
        >
          [S] CRÉDITO
          <CreditIcon />
        </Button>
        <Button
          className="ant-btn"
          onClick={() => handleOpenPayment(PaymentType.DEBITO, "Débito")}
        >
          [D] DÉBITO
          <DebitIcon />
        </Button>
        <Button
          className="ant-btn"
          onClick={() => handleOpenPayment(PaymentType.TICKET, "Ticket")}
        >
          [T] TICKET
          <TicketIcon />
        </Button>

        <Button
          className="ant-btn"
          onClick={() => handleOpenPayment(PaymentType.PIX, "PIX")}
        >
          [P] PIX
          <img
            src={PixLogo}
            style={{
              width: "25px",
              height: "25px",
            }}
          />
        </Button>
      </Header>
      <Footer>
        <AmountContainer span={6}>
          <AmountDescription>Desconto:</AmountDescription>
          <AmountValue>
            R$ {sale.discount.toFixed(2).replace(".", ",")}
          </AmountValue>
        </AmountContainer>
      </Footer>
     */}

      <Modal
        title={`Pagamento em ${modalTitle}`}
        width={250}
        visible={modalState}
        onCancel={onModalCancel}
        onOk={() => addPayment()}
        destroyOnClose={true}
        closable={true}
        afterClose={() => document.getElementById("mainContainer").focus()}
      >
        Valor:
        <Input
          autoFocus={true}
          getValue={getAmount}
          onEnterPress={addPayment}
          defaultValue={sale.total_sold - sale.total_paid}
        />
      </Modal>
    </Container>
  );
};

export default PaymentsContainer;
