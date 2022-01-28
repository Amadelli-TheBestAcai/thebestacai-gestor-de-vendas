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
  Footer,
  ButtonCancel,
  ButtonSave,
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
      label: "Dinheiro [A]",
      background: "var(--green-400)",
      action: () => handleOpenPayment(PaymentType.DINHEIRO, "Dinheiro"),
    },
    {
      icon: <CreditIcon />,
      label: "Crédito [S]",
      background: "var(--blue-300)",
      action: () => handleOpenPayment(PaymentType.CREDITO, "C. Crédito"),
    },
    {
      icon: <DebitIcon />,
      label: "Débito [D]",
      background: "var(--blue-400)",
      action: () => handleOpenPayment(PaymentType.DEBITO, "C. Débito"),
    },
    {
      icon: <TicketIcon />,
      label: "Ticket",
      background: "var(--purple-450)",
      action: () => handleOpenPayment(PaymentType.TICKET, "Ticket"),
    },
    {
      icon: <PixIcon src={PixLogo} />,
      label: "Pix [P]",
      background: "var(--teal-400)",
      action: () => handleOpenPayment(PaymentType.PIX, "Pix"),
    },
  ];

  return (
    <Container>
      <TypesPaymentsContainer>
        {buttonsPaymentsStyle.map((buttonStyle, index) => (
          <Button
            key={index}
            style={{ background: buttonStyle.background }}
            onClick={buttonStyle.action}
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
          R$ Desconto <br />{" "}
          <strong style={{ color: "var(--green-600" }}>
            {sale.total_paid.toFixed(2).replace(".", ",")}
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
      <Modal
        title={`Pagamento em ${modalTitle}`}
        visible={modalState}
        onCancel={onModalCancel}
        destroyOnClose={true}
        closable={true}
        centered
        afterClose={() => document.getElementById("mainContainer").focus()}
        footer={
          <Footer>
            <ButtonCancel onClick={onModalCancel}>Cancelar</ButtonCancel>
            <ButtonSave onClick={addPayment}>Salvar Alteração</ButtonSave>
          </Footer>
        }
      >
        Valor:
        <Input
          autoFocus={true}
          getValue={getAmount}
          onEnterPress={addPayment}
          defaultValue={
            modalTitle !== "Dinheiro" ? sale.total_sold - sale.total_paid : 0
          }
        />
      </Modal>
    </Container>
  );
};

export default PaymentsContainer;
