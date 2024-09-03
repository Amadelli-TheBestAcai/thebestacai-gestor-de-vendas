import React, { useState, Dispatch, SetStateAction } from "react";
import moment from "moment";
import { v4 } from "uuid";

import { SaleDto } from "../../../../models/dtos/sale";
import { useStore } from "../../../../hooks/useStore";

import pix from "../../../../assets/totem/svg/pix.svg";
import credit_card from "../../../../assets/totem/svg/credit_card.svg";
import debit_card from "../../../../assets/totem/svg/debit_card.svg";
import ticket from "../../../../assets/totem/svg/ticket.svg";
import arrow_left from "../../../../assets/totem/svg/arrow_left.svg";

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
  const [loading, setLoading] = useState(false);
  const { store } = useStore();

  const onFinish = async () => {
    try {
      setLoading(true);
      const updatedSale = { ...sale };

      //TODO: REMOVER ESSE MOCK DE PAGAMENTO APÓS A IMPLEMENTAÇÃO DO TEF
      updatedSale.payments.push({
        id: v4(),
        amount: sale.total_sold,
        type: 2,
        flag_card: 1,
        formated_type: "DEBITO",
        created_at: moment(new Date()).format("DD/MM/YYYY HH:mm:ss"),
      });
      // **

      const nfcePayload = {
        cpf: updatedSale.cpf_used_nfce ? updatedSale.client_cpf : null,
        email: "", // TODO: validar se o email do cliente não deveria vir aqui
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
          amount: payment.amount,
          type: payment.type,
          flag_card:
            payment.type === 1 || payment.type === 2 ? payment.flag_card : null,
        })),
        ref: updatedSale.ref,
      };

      const {
        response: nfceResponse,
        has_internal_error: errorOnEmitNfce,
        error_message,
      } = await window.Main.sale.emitNfce(nfcePayload, null, true);
      if (errorOnEmitNfce) {
        if (error_message === "Store token not found.") {
          notification.error({
            message: "O token da nota fiscal não está cadastrado na loja.",
            duration: 5,
          });
          return;
        }
        return notification.error({
          message: error_message || "Erro ao emitir NFCe",
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

      setSale(updatedSale);
      setStep(6);
      setLoading(false);
    } catch (error) {
      //TODO: criar uma validação melhor aqui
      notification.error({
        message: "Oops, ocorreu um erro interno",
        duration: 5,
      });
      console.log(error);
    }
  };

  return (
    <Container>
      <Header>
        <span>Forma de Pagamento</span>
      </Header>
      <Body>
        <Button onClick={() => setStep(6)}>
          <img src={pix} /> PIX
        </Button>
        <Button onClick={() => setStep(6)} loading={loading}>
          <img src={credit_card} /> Cartão de Crédito
        </Button>
        <Button onClick={() => setStep(6)} loading={loading}>
          <img src={debit_card} /> Cartão de Débito
        </Button>
        <Button onClick={() => setStep(6)} loading={loading}>
          <img src={ticket} /> Vale Refeição
        </Button>
      </Body>
      <Footer>
        <ButtonCancel onClick={() => setStep(4)}>
          <img src={arrow_left} /> Voltar
        </ButtonCancel>
      </Footer>
    </Container>
  );
};

export default Payment;
