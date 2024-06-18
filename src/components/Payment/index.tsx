import React, { Dispatch, SetStateAction, useState } from "react";

import { PaymentDto } from "../../models/dtos/payment";
import { PaymentType } from "../../models/enums/paymentType";
import { FlagCard } from "../../models/enums/flagCard";

import Spinner from "../Spinner";

import { Tooltip, Modal, notification } from "antd";

import {
  Container,
  Content,
  InfoPayment,
  Column,
  Button,
  DeleteIcon,
} from "./styles";

type IProps = {
  payment: PaymentDto;
  removePayment: (payment: PaymentDto) => Promise<void>;
  loadingPayment: boolean;
  setLoadingPayment: Dispatch<SetStateAction<boolean>>;
};

const Payment: React.FC<IProps> = ({
  payment,
  removePayment,
  loadingPayment,
  setLoadingPayment,
}) => {
  const deletePaymentConfirm = () => {
    Modal.confirm({
      title: "Excluir Pagamento",
      content: (
        <>
          <p>Este pagamento foi autorizado via TEF</p>
          <p>Código NSU: {payment?.code_nsu}</p>
          <p>Forma de pagamento: {PaymentType[payment.type]}</p>
          <p>
            Bandeira:
            {FlagCard.find((flag) => flag.id === payment.flag_card)?.value}
          </p>
          <p>Valor: {payment.amount?.toFixed(2).replace(".", ",")}</p>
          <p>Tem certeza que deseja excluí-lo?</p>
        </>
      ),
      okText: "Sim",
      okType: "default",
      cancelText: "Não",
      centered: true,
      async onOk() {
        setLoadingPayment(true);
        try {
          {
            const isConnected = await window.Main.hasInternet();

            if (!isConnected) {
              Modal.confirm({
                title: ` Durante remoção do pagamento, foi constatada a falta de conexão com
                  a internet.`,
                content: (
                  <>
                    <p>Após a remoção do pagamento</p>{" "}
                    <p>Código NSU: {payment?.code_nsu}</p>
                    <p>Forma de pagamento: {PaymentType[payment.type]}</p>
                    <p>
                      Bandeira:
                      {
                        FlagCard.find((flag) => flag.id === payment.flag_card)
                          ?.value
                      }
                    </p>
                    <p>Valor: {payment.amount?.toFixed(2).replace(".", ",")}</p>
                    <p>
                      Você deve entrar no CPOSWEB e cancelar o pagamento
                      removido.
                    </p>
                  </>
                ),
                okText: "Remover pagamento",
                okType: "default",
                centered: true,
                okButtonProps: {
                  style: {
                    background: "green",
                    color: "white",
                  },
                },
                async onOk() {
                  await removePayment(payment);
                },
              });
            } else {
              await removePayment(payment),
                document.getElementById("balanceInput")?.focus();
              notification.success({
                message: `O pagamento TEF de numero: ${payment.code_nsu} e valor: ${payment.amount} foi desfeito com sucesso`,
                duration: 5,
              });
            }
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoadingPayment(false);
        }
      },
    });
  };

  return (
    <Container>
      {loadingPayment ? (
        <Spinner />
      ) : (
        <Content>
          <InfoPayment key={payment.id}>
            <Column sm={6}>{PaymentType[payment.type]}</Column>
            <Column sm={6}>
              {payment.flag_card
                ? FlagCard.find((flag) => flag.id === payment.flag_card)?.value
                : ""}
            </Column>
            <Column sm={6}>
              R$ {payment.amount?.toFixed(2).replace(".", ",")}
            </Column>
            <Column sm={6}>
              <Tooltip title="Remover" placement="bottom">
                <Button
                  onClick={() => {
                    payment.code_nsu
                      ? deletePaymentConfirm()
                      : removePayment(payment);
                    document.getElementById("balanceInput")?.focus();
                  }}
                >
                  <DeleteIcon />
                </Button>
              </Tooltip>
            </Column>
          </InfoPayment>
        </Content>
      )}
    </Container>
  );
};

export default Payment;
