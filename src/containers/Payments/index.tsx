import React, { Dispatch, SetStateAction } from "react";

import { PaymentType } from "../../models/enums/paymentType";
import { SaleDto } from "../../models/dtos/sale";

import Payment from "../../components/Payment";

// import PixLogo from "../../assets/svg/pix.svg";

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
  Header,
  Column,
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
      label: "Ticket [T]",
      background: "var(--purple-450)",
      action: () => handleOpenPayment(PaymentType.TICKET, "Ticket"),
    },
    {
      // icon: <PixIcon src={PixLogo} />,
      label: "Pix [P]",
      background: "var(--teal-400)",
      action: () => handleOpenPayment(PaymentType.PIX, "Pix"),
    },
  ];

  const getChangeAmount = (total_sold: number, total_paid: number) => {
    if (total_paid > total_sold) {
      const result = (total_paid - total_sold).toFixed(2).replace(".", ",");
      return result;
    } else if (total_paid === total_sold) {
      const result = (0).toFixed(2).replace(".", ",");
      return result;
    } else {
      return "0,00";
    }
  };

  return (
    <Container>
      <TypesPaymentsContainer>
        {buttonsPaymentsStyle.map((buttonStyle, index) => (
          <Button
            key={index}
            style={{ background: buttonStyle.background }}
            onClick={buttonStyle.action}
            disabled={!sale.items.length}
          >
            {buttonStyle.icon} {buttonStyle.label}
          </Button>
        ))}
      </TypesPaymentsContainer>

      <PaymentsInfoContainer>
        <Header>
          <Column sm={8}>Forma de Pagamento</Column>
          <Column sm={8}>Valor</Column>
          <Column sm={8}>Ação</Column>
        </Header>
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
            {getChangeAmount(sale.total_sold, sale.total_paid)}
          </strong>
        </ValueInfo>
        <ValueInfo>
          R$ Desconto <br />{" "}
          <strong style={{ color: "var(--green-600" }}>
            {sale.discount.toFixed(2).replace(".", ",")}
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
