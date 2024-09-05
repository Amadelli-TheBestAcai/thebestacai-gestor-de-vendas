import React, { useState, Dispatch, SetStateAction } from "react";

import pix from "../../../../assets/totem/svg/pix.svg";
import ticket from "../../../../assets/totem/svg/ticket.svg";
import debit_card from "../../../../assets/totem/svg/debit_card.svg";
import arrow_left from "../../../../assets/totem/svg/arrow_left.svg";
import credit_card from "../../../../assets/totem/svg/credit_card.svg";

import { PaymentType } from "../../../../models/enums/paymentType";

import { useSale } from "../../../../hooks/useSale";
import { useSettings } from "../../../../hooks/useSettings";

import { notification } from "antd";

import {
  Container,
  Button,
  Body,
  Header,
  Footer,
  ButtonCancel,
} from "./styles";

interface IProps {
  setStep: Dispatch<SetStateAction<number>>;
}
const Payment: React.FC<IProps> = ({ setStep }) => {
  const { sale, setSale } = useSale();
  const { settings } = useSettings();
  const [loading, setLoading] = useState(false);
  const [stepPayment, setStepPayment] = useState<1 | 2 | 3>(1);

  const onFinish = async (method: number) => {
    if (!settings?.should_use_tef)
      return notification.info({
        message: "Tef desativado",
        description: "Chame o atendente para realizar a ativação do Tef",
        duration: 5,
      });
    setLoading(true);
    setStepPayment(method === PaymentType.PIX ? 2 : 3);

    const {
      response: updatedSale,
      has_internal_error: errorOnAddPayment,
      error_message: error_message_payment,
    } = await window.Main.sale.addPayment(sale.total_sold, method);

    if (errorOnAddPayment) {
      setLoading(false);
      return notification.error({
        message: error_message_payment || "Erro ao adicionar pagamento",
        duration: 5,
      });
    }

    notification.success({
      message: `Pagamento adicionado com sucesso`,
      duration: 5,
    });

    setSale(updatedSale);
    setStep(6);
    setLoading(false);
  };

  return (
    <>
      {stepPayment === 1 && (
        <Container>
          <Header>
            <span>Forma de Pagamento</span>
          </Header>
          <Body>
            <Button onClick={() => onFinish(PaymentType.PIX)}>
              <img src={pix} /> PIX
            </Button>
            <Button onClick={() => onFinish(PaymentType.CREDITO)}>
              <img src={credit_card} /> Cartão de Crédito
            </Button>
            <Button onClick={() => onFinish(PaymentType.DEBITO)}>
              <img src={debit_card} /> Cartão de Débito
            </Button>
            <Button onClick={() => onFinish(PaymentType.TICKET)}>
              <img src={ticket} /> Vale Refeição
            </Button>
          </Body>
          <Footer>
            <div>
              <ButtonCancel onClick={() => setStep(1)}>
                Cancelar Pedido
              </ButtonCancel>
              <ButtonCancel onClick={() => setStep(4)}>
                <img src={arrow_left} /> Voltar
              </ButtonCancel>
            </div>
          </Footer>
        </Container>
      )}
      {stepPayment === 2 && (
        <Container>
          <Header>
            <span>Abra o app do seu banco</span>
          </Header>
          <Body>
            <span>Faça a leitura do QR Code no Pinpad.</span>
          </Body>
          <Footer>
            <ButtonCancel
              onClick={() => setStepPayment(1)}
              style={{ width: "36.5rem" }}
              loading={loading}
            >
              Trocar Forma de Pagamento
            </ButtonCancel>
          </Footer>
        </Container>
      )}
      {stepPayment === 3 && (
        <Container>
          <Header>
            <span>Veja a maquininha</span>
          </Header>
          <Body>
            <span>Siga as instruções da máquina de cartões.</span>
          </Body>
          <Footer>
            <ButtonCancel
              onClick={() => setStepPayment(1)}
              style={{ width: "36.5rem" }}
              loading={loading}
            >
              Trocar Forma de Pagamento
            </ButtonCancel>
          </Footer>
        </Container>
      )}
    </>
  );
};

export default Payment;
