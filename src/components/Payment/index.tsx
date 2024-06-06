import React from "react";

import { PaymentDto } from "../../models/dtos/payment";
import { PaymentType } from "../../models/enums/paymentType";

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
  removePayment: (id: string) => Promise<void>;
};

const Payment: React.FC<IProps> = ({ payment, removePayment }) => {
  const deletePaymentConfirm = () => {
    Modal.confirm({
      title: 'Excluir Pagamento',
      content: 'Esse pagamento foi autorizado pelo TEF, você tem certeza que deseja desfaze-lo?',
      okText: "Sim",
      okType: "default",
      cancelText: "Não",
      centered: true,
      async onOk() {
        try {
          {
            removePayment(payment.id),
              document.getElementById("balanceInput")?.focus();
            notification.success({
              message: `O pagamento TEF de numero ${payment.code_nsu} foi desfeito com sucesso`,
              duration: 5
            })
          }
        } catch (error) {
          console.log(error);
        }
      },
    });


  }


  return (
    <Container>
      <Content>
        <InfoPayment key={payment.id}>
          <Column sm={8}>{PaymentType[payment.type]}</Column>
          <Column sm={8}>
            R$ {payment.amount?.toFixed(2).replace(".", ",")}
          </Column>
          <Column sm={8}>
            <Tooltip title="Remover" placement="bottom">
              <Button
                onClick={() => {
                  payment.code_nsu ? deletePaymentConfirm() :

                    removePayment(payment.id);
                  document.getElementById("balanceInput")?.focus()
                }}
              >
                <DeleteIcon />
              </Button>
            </Tooltip>
          </Column>
        </InfoPayment>
      </Content>
    </Container >
  );
};

export default Payment;
