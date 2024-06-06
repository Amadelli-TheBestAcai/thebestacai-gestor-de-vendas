import React, { Dispatch, SetStateAction } from "react";

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
  Header,
  Column,
  OnlineIcon,
  Select,
  Option,
  RemoveIcon
} from "./styles";
import { FlagCard } from "../../models/enums/flagCard";
import { Form } from "antd";
import { useSale } from "../../hooks/useSale";
import { useSettings } from "../../hooks/useSettings";

interface IProps {
  sale: SaleDto;
  removePayment: (id: string) => Promise<void>;
  addPayment: () => Promise<void>;
  handleOpenPayment: (type: number, title: string, flag_card?: number) => void;
  setCurrentPayment: Dispatch<SetStateAction<number>>;
  setFlagCard?: Dispatch<SetStateAction<number>>;
  flagCard?: number;
  setModalState: Dispatch<SetStateAction<boolean>>;
  modalState: boolean;
  modalTitle: string;
  shouldViewValues?: boolean;
  shouldDisableButtons?: boolean;
  usingDelivery?: boolean;
  loadingPayment?: boolean
}

const PaymentsContainer: React.FC<IProps> = ({
  sale,
  removePayment,
  addPayment,
  setModalState,
  modalState,
  setCurrentPayment,
  handleOpenPayment,
  modalTitle,
  shouldViewValues,
  shouldDisableButtons,
  usingDelivery,
  setFlagCard,
  flagCard,
  loadingPayment
}) => {
  const { onRemoveDiscount } = useSale();
  const { settings } = useSettings();

  const onModalCancel = (): void => {
    setModalState(false);
    setFlagCard(99);
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
      action: () =>
        handleOpenPayment(PaymentType.CREDITO, "C. Crédito", flagCard),
    },
    {
      icon: <DebitIcon />,
      label: "Débito [D]",
      background: "var(--blue-400)",
      action: () =>
        handleOpenPayment(PaymentType.DEBITO, "C. Débito", flagCard),
    },
    {
      icon: usingDelivery ? <OnlineIcon /> : <TicketIcon />,
      label: usingDelivery ? "Online [O]" : "Ticket [T]",
      background: usingDelivery ? "var(--orange-400)" : "var(--purple-450)",
      action: usingDelivery
        ? () => handleOpenPayment(PaymentType.ONLINE, "Online")
        : () => handleOpenPayment(PaymentType.TICKET, "Ticket"),
    },
    {
      icon: <PixIcon src={PixLogo} />,
      label: "Pix [P]",
      background: "var(--teal-400)",
      action: () => handleOpenPayment(PaymentType.PIX, "Pix"),
    },
  ];

  const getChangeAmount = () => {
    if (sale.total_paid + sale.discount > sale.total_sold) {
      const result = (
        sale.total_paid -
        sale.total_sold +
        sale.discount
      ).toFixed(2);
      return result;
    } else {
      return "0";
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
            disabled={shouldDisableButtons && !sale?.items?.length}
          >
            {buttonStyle.icon} {buttonStyle.label}
          </Button>
        ))}
      </TypesPaymentsContainer>

      <PaymentsInfoContainer>
        <Header>
          <Column sm={6}>Forma de Pagamento</Column>
          <Column sm={6}>Bandeira</Column>
          <Column sm={6}>Valor</Column>
          <Column sm={6}>Ação</Column>
        </Header>
        {sale?.payments?.map((payment) => (
          <Payment
            key={payment.id}
            payment={payment}
            removePayment={removePayment}
          />
        ))}
      </PaymentsInfoContainer>

      {shouldViewValues && (
        <ValuesContainer>
          <ValueInfo>
            R$ Diferença <br />{" "}
            <strong style={{ color: "var(--red-600" }}>
              {(
                sale?.total_paid +
                (sale?.discount + (sale?.customer_nps_reward_discount || 0)) -
                sale?.total_sold -
                +getChangeAmount()
              )
                .toFixed(2)
                .replace(".", ",")}
            </strong>
          </ValueInfo>
          <ValueInfo>
            R$ Troco
            <br />{" "}
            <strong style={{ color: "var(--red-600" }}>
              {(+getChangeAmount()).toFixed(2).replace(".", ",")}
            </strong>
          </ValueInfo>
          <ValueInfo>
            R$ Desconto
            <br />{" "}
            <strong style={{ color: "var(--green-600" }}>
              {((sale.customer_nps_reward_discount || 0) + sale?.discount)
                .toFixed(2)
                .replace(".", ",")}
              {sale?.discount > 0 && <RemoveIcon onClick={() => onRemoveDiscount(sale.id)}/>}
            </strong>
          </ValueInfo>
          <ValueInfo>
            R$ Valor Pago <br />{" "}
            <strong style={{ color: "var(--green-600" }}>
              {sale?.total_paid.toFixed(2).replace(".", ",")}
            </strong>
          </ValueInfo>
          <ValueInfo>
            Quantidade Itens <br />{" "}
            <strong style={{ color: "var(--grey-80" }}>
              {sale?.quantity || 0}
            </strong>
          </ValueInfo>
        </ValuesContainer>
      )}

      <Modal
        title={`Pagamento em ${modalTitle}`}
        visible={modalState}
        onCancel={onModalCancel}
        destroyOnClose={true}
        closable={true}
        centered
        afterClose={() => document.getElementById("balanceInput")?.focus()}
        footer={
          <Footer>
            <ButtonCancel onClick={onModalCancel}>Cancelar</ButtonCancel>
            <ButtonSave loading={loadingPayment} onClick={addPayment}>{
              settings?.should_use_tef
                && modalTitle !== "Dinheiro" ? 'Solicitar Pagamento TEF'
                : 'Salvar Alteração'}</ButtonSave>
          </Footer>
        }
      >
        Valor:
        <Input
          autoFocus={true}
          getValue={getAmount}
          onEnterPress={addPayment}
          defaultValue={
            modalTitle !== "Dinheiro"
              ? sale?.total_sold -
              sale?.total_paid -
              sale?.discount -
              (sale?.customer_nps_reward_discount || 0)
              : 0
          }
        />
        {(!settings?.should_use_tef) && (modalTitle === "C. Crédito" || modalTitle === "C. Débito") && (
          <>
            Bandeira:
            <Form.Item>
              <Select
                placeholder="Escolha a opção"
                onChange={(value) => setFlagCard(+value)}
                defaultValue={"Outros"}
              >
                {FlagCard.map((_flagCard) => (
                  <Option key={_flagCard.id}>{_flagCard.value}</Option>
                ))}
              </Select>
            </Form.Item>
          </>
        )}
      </Modal>
    </Container>
  );
};

export default PaymentsContainer;
