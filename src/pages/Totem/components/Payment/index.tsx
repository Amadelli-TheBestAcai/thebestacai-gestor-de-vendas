import React, { useState, Dispatch, SetStateAction } from "react";

import pix from "../../../../assets/totem/svg/pix.svg";
import ticket from "../../../../assets/totem/svg/ticket.svg";
import debit_card from "../../../../assets/totem/svg/debit_card.svg";
import arrow_left from "../../../../assets/totem/svg/arrow_left.svg";
import credit_card from "../../../../assets/totem/svg/credit_card.svg";

import { SaleDto } from "../../../../models/dtos/sale";
import { SalesTypes } from "../../../../models/enums/salesTypes";
import { PaymentType } from "../../../../models/enums/paymentType";

import { useStore } from "../../../../hooks/useStore";

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
  sale: SaleDto | null;
  setSale: Dispatch<SetStateAction<SaleDto | null>>;
}
const Payment: React.FC<IProps> = ({ setStep, sale, setSale }) => {
  const { store } = useStore();
  const [loading, setLoading] = useState(false);
  const [stepPayment, setStepPayment] = useState<1 | 2 | 3>(1);

  const onFinish = async (method: number) => {
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

    const {
      has_internal_error: errorOnPrintCupomTef,
      error_message: error_message_print_cupom_tef,
    } = await window.Main.common.printCouponTef();

    if (errorOnPrintCupomTef) {
      notification.error({
        message: error_message_print_cupom_tef || "Erro ao imprimir cupom",
        duration: 5,
      });
    }

    const codes_nsu = updatedSale.payments
      .map((payment) => payment.code_nsu)
      .filter((code_nsu) => code_nsu !== undefined && code_nsu !== null);

    const {
      has_internal_error: errorOnFinalizaTransacao,
      error_message: error_message_finalize_tef,
    } = await window.Main.tefFactory.finalizeTransaction(codes_nsu);

    if (errorOnFinalizaTransacao) {
      notification.error({
        message:
          error_message_finalize_tef || "Erro ao finalizar transação TEF",
        duration: 5,
      });
      setLoading(false);
      return;
    }

    const nfcePayload = {
      cpf: updatedSale.cpf_used_nfce ? updatedSale.client_cpf : null,
      store_id: store.company_id,
      total: updatedSale.total_sold,
      discount: 0,
      change_amount: 0,
      items: updatedSale.items.map((product) => ({
        product_store_id: product.store_product_id,
        price_sell: product.total,
        quantity: product.quantity,
      })),
      payments: updatedSale.payments.map((payment) => ({
        amount: +payment.amount.toFixed(2),
        type: +payment.type,
        flag_card: payment.flag_card ? +payment.flag_card : payment.flag_card,
        code_nsu: payment.code_nsu ? payment.code_nsu : null,
        cnpj_credenciadora: payment.code_nsu
          ? payment.cnpj_credenciadora
          : null,
        numero_autorizacao: payment.code_nsu
          ? payment.numero_autorizacao
          : null,
        cnpj_beneficiario: payment.code_nsu ? payment.cnpj_beneficiario : null,
        id_terminal_pagamento: payment.code_nsu
          ? payment.id_terminal_pagamento
          : null,
      })),
      ref: updatedSale.ref,
    };

    const {
      response: nfceResponse,
      has_internal_error: errorOnEmitNfce,
      error_message: error_message_emit_nfe,
    } = await window.Main.sale.emitNfce(nfcePayload, null, true);
    if (errorOnEmitNfce) {
      if (error_message_emit_nfe === "Store token not found.") {
        notification.error({
          message: "O token da nota fiscal não está cadastrado na loja.",
          duration: 5,
        });
        return;
      }
      return notification.error({
        message: error_message_emit_nfe || "Erro ao emitir NFCe",
        duration: 5,
      });
    }

    if (nfceResponse.status_sefaz !== "100") {
      notification.error({
        message: nfceResponse.mensagem_sefaz || nfceResponse.mensagem,
        duration: 5,
      });
      return;
    } else {
      notification.success({
        message: nfceResponse.mensagem_sefaz,
        duration: 5,
      });

      updatedSale.nfce_focus_id = nfceResponse.id;
      updatedSale.nfce_url = `https://api.focusnfe.com.br${nfceResponse.caminho_xml_nota_fiscal}`;
    }

    const {
      has_internal_error: errorOnFinishSAle,
      error_message: error_message_finalize_sale,
    } = await window.Main.sale.finishSale({
      ...updatedSale,
      formated_type: SalesTypes[updatedSale.type],
    });

    if (errorOnFinishSAle) {
      setLoading(false);

      error_message_finalize_sale
        ? notification.warning({
            message: error_message_finalize_sale,
            duration: 5,
          })
        : notification.error({
            message: "Erro ao finalizar venda",
            duration: 5,
          });
    }

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
            <ButtonCancel onClick={() => setStep(4)}>
              <img src={arrow_left} /> Voltar
            </ButtonCancel>
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
