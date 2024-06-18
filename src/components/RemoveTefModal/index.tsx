import React, { useState, useEffect, Dispatch, SetStateAction } from "react";

import { useSale } from "../../hooks/useSale";

import { FlagCard } from "../../models/enums/flagCard";
import { PaymentType } from "../../models/enums/paymentType";
import { TefPaymentType } from "../../models/enums/tefPaymentType";

import { notification } from "antd";

import {
  ButtonRemove,
  Container,
  Footer,
  HeaderRow,
  HeaderCol,
  Row,
  Col,
} from "./styles";

const RemoveTefModal: React.FC = () => {
  const { sale, setSale, visibleRemoveTefModal, setVisibleRemoveTefModal } =
    useSale();
    const [loading, setLoading] = useState<boolean>(false)

  const paymentsTef = sale.payments.filter((_payment) => _payment.code_nsu);

  const removePaymentsTef = async () => {
    setLoading(true)
    for (const _payment of paymentsTef) {
      const {
        response: updatedSale,
        has_internal_error: errorOnDeletePayment,
      } = await window.Main.sale.deletePayment(_payment.id);

      if (errorOnDeletePayment) {
        setLoading(false)
        notification.error({
          message: "Erro ao remover pagamento",
          duration: 5,
        });
        return;
      }
      setSale(updatedSale);
    }

    setLoading(false)
    setVisibleRemoveTefModal(false);
  };

  return (
    <Container
      title={<h2>Remover pagamentos TEF</h2>}
      visible={visibleRemoveTefModal}
      centered
      width={800}
      closable={false}
      onCancel={() => setVisibleRemoveTefModal(false)}
      footer={
        <Footer>
          <ButtonRemove onClick={removePaymentsTef} loading={loading}>
            Remover Pagamentos
          </ButtonRemove>
        </Footer>
      }
    >
      <>
        <p>
          Durante a finalização da venda, foi constatada a falta de conexão com
          a internet. Esta venda possui pagamentos autorizados via TEF e para
          prosseguir, é necessário remover esses pagamentos.
        </p>
        <HeaderRow>
          <HeaderCol sm={5}>CODIGO NSU</HeaderCol>
          <HeaderCol sm={5}>TIPO</HeaderCol>
          <HeaderCol sm={5}>BANDEIRA</HeaderCol>
          <HeaderCol sm={4}>VALOR</HeaderCol>
          <HeaderCol sm={4}>STATUS</HeaderCol>
        </HeaderRow>
        {paymentsTef?.map((_payment, index) => (
          <Row key={index}>
            <Col sm={5}>{_payment.code_nsu}</Col>
            <Col sm={5}>{PaymentType[_payment.type]}</Col>
            <Col sm={5}>
              {_payment.flag_card
                ? FlagCard.find((flag) => flag.id === _payment.flag_card)?.value
                : ""}
            </Col>
            <Col sm={4}>{_payment.amount}</Col>
            <Col sm={4}>{TefPaymentType[_payment?.tef_status_payment]}</Col>
          </Row>
        ))}
        <b>
          Após a remoção dos pagamento TEF você deve entrar no CPOSWEB e
          verificar os pagamentos a serem cancelados.
        </b>
      </>
    </Container>
  );
};

export default RemoveTefModal;
