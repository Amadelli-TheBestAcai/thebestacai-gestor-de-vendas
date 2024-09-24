import React, {
  useState,
  Dispatch,
  SetStateAction,
  useRef,
  useEffect,
} from "react";

import pix from "../../../../assets/totem/svg/pix.svg";
import ticket from "../../../../assets/totem/svg/ticket.svg";
import debit_card from "../../../../assets/totem/svg/debit_card.svg";
import arrow_left from "../../../../assets/totem/svg/arrow_left.svg";
import credit_card from "../../../../assets/totem/svg/credit_card.svg";

import { PaymentType } from "../../../../models/enums/paymentType";

import { useSale } from "../../../../hooks/useSale";
import { useSettings } from "../../../../hooks/useSettings";

import ModalInfo from "../ModalInfo";

import { notification } from "antd";

import {
  Container,
  Button,
  Body,
  Header,
  Footer,
  ButtonCancel,
  Modal,
  ButtonModal,
  ButtonPrintModal,
} from "./styles";

interface IProps {
  setCancelTimer: Dispatch<SetStateAction<boolean>>;
  setStep: Dispatch<SetStateAction<number>>;
  setPrinter: Dispatch<SetStateAction<boolean>>;
  cancelSale: () => void;
}
const Payment: React.FC<IProps> = ({
  setCancelTimer,
  setStep,
  cancelSale,
  setPrinter,
}) => {
  const { sale, setSale } = useSale();
  const { settings } = useSettings();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [visiblePrintTefModal, setVisiblePrintTefModal] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [stepPayment, setStepPayment] = useState<1 | 2 | 3>(1);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visiblePrintTefModal) {
      timeoutRef.current = setTimeout(() => {
        setVisiblePrintTefModal(false);
        setPrinter(false);
        setStep(6);
      }, 10000);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visiblePrintTefModal]);

  const onFinish = async (method: number) => {
    let hasInternet = await window.Main.hasInternet();
    if (!hasInternet) {
      return notification.info({
        message: "Problema de conexão",
        description:
          "Espere um momento e tente novamente, caso o problema persista informe o atendente.",
        duration: 5,
        className: "notification-totem",
      });
    }

    if (!settings?.should_use_tef)
      return notification.info({
        message: "Tef desativado",
        description: "Chame o atendente para realizar a ativação do Tef",
        duration: 5,
        className: "notification-totem",
      });
    setLoading(true);
    setCancelTimer(true);
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
        description: "Por favor contate o atendente",
        duration: 5,
        className: "notification-totem",
      });
    }

    notification.success({
      message: `Pagamento adicionado com sucesso`,
      description: "Agradecemos por utilizar nosso serviço",
      duration: 5,
      className: "notification-totem",
    });

    setSale(updatedSale);
    setVisiblePrintTefModal(true);
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
              <ButtonCancel onClick={() => setVisibleModal(true)}>
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
              onClick={() => {
                setStepPayment(1);
                setCancelTimer(false);
              }}
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
              onClick={() => {
                setStepPayment(1);
                setCancelTimer(false);
              }}
              style={{ width: "36.5rem" }}
              loading={loading}
            >
              Trocar Forma de Pagamento
            </ButtonCancel>
          </Footer>
        </Container>
      )}
      <ModalInfo
        visible={visibleModal}
        setVisible={setVisibleModal}
        cancelSale={cancelSale}
      />

      <Modal
        visible={visiblePrintTefModal}
        confirmLoading={loading}
        cancelButtonProps={{ hidden: true }}
        closable={false}
        centered
        width={"62.5rem"}
        style={{ height: "24rem" }}
        footer={false}
      >
        <>
          <span className="modal-title">
            Deseja realizar a impressão do cupom TEF e NFCe?
          </span>
          <div>
            <ButtonModal
              onClick={() => {
                setVisiblePrintTefModal(false);
                setPrinter(false);
                setStep(6);
              }}
            >
              Pular
            </ButtonModal>
            <ButtonPrintModal
              onClick={() => {
                setVisiblePrintTefModal(false);
                setPrinter(true);
                setStep(6);
              }}
            >
              Desejo Imprimir
            </ButtonPrintModal>
          </div>
        </>
      </Modal>
    </>
  );
};

export default Payment;
