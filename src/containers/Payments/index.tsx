import React, { Dispatch, SetStateAction } from "react";

import { PaymentType } from "../../models/enums/paymentType";
import { SaleDto } from "../../models/dtos/sale";

import Payment from "../../components/Payment";

import {
  Container,
  PaymentsList,
  Button,
  Modal,
  Input,
  Header,
  Content,
  Footer,
  ListContainer,
  AmountContainer,
  AmountValue,
  AmountDescription,
  MoneyIcon,
  CreditIcon,
  DebitIcon,
  TicketIcon,
} from "./styles";

import PixLogo from "../../assets/img/pix.png";

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

  return (
    <Container>
      <Header>
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
      <Content>
        <ListContainer>
          <PaymentsList>
            {sale.payments?.map((payment, index) => (
              <Payment
                key={index}
                payment={payment}
                removePayment={removePayment}
              />
            ))}
          </PaymentsList>
        </ListContainer>
      </Content>
      <Footer>
        <AmountContainer span={6}>
          <AmountDescription>Troco</AmountDescription>
          <AmountValue
            style={{
              color: sale.change_amount < 0 ? "red" : "#fff",
              background: "#FF9D0A",
            }}
          >
            R$ {sale.change_amount.toFixed(2).replace(".", ",")}
          </AmountValue>
        </AmountContainer>
        <AmountContainer span={6}>
          <AmountDescription>Valor Pago</AmountDescription>
          <AmountValue>
            R$ {sale.total_paid.toFixed(2).replace(".", ",")}
          </AmountValue>
        </AmountContainer>
        <AmountContainer span={6}>
          <AmountDescription>Desconto:</AmountDescription>
          <AmountValue>
            R$ {sale.discount.toFixed(2).replace(".", ",")}
          </AmountValue>
        </AmountContainer>
        <AmountContainer span={6}>
          <AmountDescription>Quantidade Itens:</AmountDescription>
          <AmountValue>{sale.quantity || 0}</AmountValue>
        </AmountContainer>
      </Footer>
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
