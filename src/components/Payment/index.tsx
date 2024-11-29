import React, { Dispatch, SetStateAction, useState } from "react";

import { PaymentDto } from "../../models/dtos/payment";
import { PaymentType } from "../../models/enums/paymentType";
import { FlagCard } from "../../models/enums/flagCard";

import Spinner from "../Spinner";

import { Tooltip, Modal, notification, Form } from "antd";

import {
  Container,
  Content,
  InfoPayment,
  Column,
  Button,
  DeleteIcon,
  RowPaymentTefHeader,
  ColPaymentTef,
  RowPaymentTef,
  Textarea,
} from "./styles";

type IProps = {
  payment: PaymentDto;
  removePayment: (payment: PaymentDto, justify?: string) => Promise<void>;
  loadingPayment: boolean;
  setLoadingPayment: Dispatch<SetStateAction<boolean>>;
};

const Payment: React.FC<IProps> = ({
  payment,
  removePayment,
  loadingPayment,
  setLoadingPayment,
}) => {
  const [formRemoveTef] = Form.useForm();

  const deletePaymentConfirm = () => {
    Modal.confirm({
      title: "Excluir Pagamento",
      content: (
        <>
          <p>Este pagamento foi autorizado via TEF</p>
          <RowPaymentTefHeader>
            <ColPaymentTef sm={6}>Código NSU</ColPaymentTef>
            <ColPaymentTef sm={6}>Forma de pagamento</ColPaymentTef>
            <ColPaymentTef sm={6}>Valor</ColPaymentTef>
            <ColPaymentTef sm={6}>Bandeira</ColPaymentTef>
          </RowPaymentTefHeader>
          <RowPaymentTef>
            <ColPaymentTef sm={6}>{payment?.code_nsu}</ColPaymentTef>
            <ColPaymentTef sm={6}>{PaymentType[payment?.type]}</ColPaymentTef>
            <ColPaymentTef sm={6}>
              {payment?.amount?.toFixed(2).replace(".", ",")}
            </ColPaymentTef>
            <ColPaymentTef sm={6}>
              {FlagCard?.find((flag) => flag?.id === payment?.flag_card)?.value}
            </ColPaymentTef>
          </RowPaymentTef>
          <p style={{ margin: "1rem 0" }}>
            Caso deseje excluir este pagamente, é necessário que digite uma
            justificativa.
          </p>
          <Form form={formRemoveTef}>
            <Form.Item
              label=""
              name="tefRemoveJustify"
              rules={[
                { required: true, message: "Campo obrigatório" },
                {
                  min: 15,
                  message: "A justificativa deve ter no minimo 15 caracteres",
                },
                {
                  max: 255,
                  message: "A justificativa deve ter no máximo 255 caracteres",
                },
              ]}
            >
              <Textarea
                name="tefRemoveJustify"
                placeholder="Justificativa - 15 a 255 caracteres"
                minLength={15}
                maxLength={255}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Form>

          <p>Tem certeza que deseja excluí-lo?</p>
        </>
      ),
      okText: "Sim",
      okType: "default",
      cancelText: "Não",
      centered: true,
      width: "50%",
      async onOk() {
        await formRemoveTef.validateFields();
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
                    <p>Após a remoção do pagamento:</p>{" "}
                    <RowPaymentTefHeader>
                      <ColPaymentTef sm={6}>Código NSU</ColPaymentTef>
                      <ColPaymentTef sm={6}>Forma de pagamento</ColPaymentTef>
                      <ColPaymentTef sm={6}>Valor</ColPaymentTef>
                      <ColPaymentTef sm={6}>Bandeira</ColPaymentTef>
                    </RowPaymentTefHeader>
                    <RowPaymentTef>
                      <ColPaymentTef sm={6}>{payment?.code_nsu}</ColPaymentTef>
                      <ColPaymentTef sm={6}>
                        {PaymentType[payment?.type]}
                      </ColPaymentTef>
                      <ColPaymentTef sm={6}>
                        {payment?.amount?.toFixed(2)?.replace(".", ",")}
                      </ColPaymentTef>
                      <ColPaymentTef sm={6}>
                        {
                          FlagCard?.find(
                            (flag) => flag?.id === payment?.flag_card
                          )?.value
                        }
                      </ColPaymentTef>
                    </RowPaymentTef>
                    <p style={{ color: "var(--red-600)" }}>
                      Você deve entrar no <b>D-TEF Web</b> através do{" "}
                      <a
                        href="https://tef.linxsaas.com.br/tefweb/DTefWeb.cgi/login"
                        target="_blank"
                        style={{ color: "blue" }}
                      >
                        LINK
                      </a>{" "}
                      e cancelar o pagamento removido.
                    </p>
                  </>
                ),
                okText: "Remover pagamento",
                okType: "default",
                centered: true,
                cancelText: "Manter Pagamento",
                okButtonProps: {
                  style: {
                    background: "var(--red-600)",
                    color: "white",
                  },
                },
                width: "50%",
                async onOk() {
                  await removePayment(
                    payment,
                    formRemoveTef.getFieldValue("tefRemoveJustify")
                  );
                  await formRemoveTef.resetFields();
                },
                async onCancel() {
                  await formRemoveTef.resetFields();
                },
              });
            } else {
              await removePayment(
                payment,
                formRemoveTef.getFieldValue("tefRemoveJustify")
              );
              await formRemoveTef.resetFields();
              document.getElementById("balanceInput")?.focus();
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
