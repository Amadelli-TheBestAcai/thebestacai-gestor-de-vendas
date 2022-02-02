import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import amountCash from "../../models/amountCash.json";
import { currencyFormater } from "../../helpers/currencyFormater";

import { Input, Modal, message as messageAnt } from "antd";

import { Container, Row, Col, ButtonRegister } from "./styles";
import { useSale } from "../../hooks/useSale";

interface IProp extends RouteComponentProps {
  storeCashToOpen?: string;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const AmountModal: React.FC<IProp> = ({
  visible,
  setVisible,
  storeCashToOpen,
  history,
}) => {
  const { storeCash } = useSale();
  const [total, setTotal] = useState(0);
  const [amount, setAmount] = useState({
    twoHundred: null,
    oneHundred: null,
    fifty: null,
    twenty: null,
    ten: null,
    five: null,
    two: null,
    one: null,
    fiftyCents: null,
    twentyFiveCents: null,
    tenCents: null,
    fiveCents: null,
    oneCents: null,
    fullAmount: null,
  });

  useEffect(() => {
    const getNewTotal = (): number => {
      let total = 0;
      total = total + +amount.twoHundred * 200;
      total = total + +amount.oneHundred * 100;
      total = total + +amount.fifty * 50;
      total = total + +amount.twenty * 20;
      total = total + +amount.ten * 10;
      total = total + +amount.five * 5;
      total = total + +amount.two * 2;
      total = total + +amount.one * 1;
      total = total + +amount.fiftyCents * 0.5;
      total = total + +amount.twentyFiveCents * 0.25;
      total = total + +amount.tenCents * 0.1;
      total = total + +amount.fiveCents * 0.05;
      total = total + +amount.oneCents * 0.01;
      total = total + +amount.fullAmount;
      return total;
    };
    setTotal(getNewTotal());
  }, [amount]);

  const onFinish = () => {
    Modal.confirm({
      title: `${storeCash?.code ? "Fechamento" : "Abertura"} de caixa`,
      content: `Tem certeza que gostaria de ${
        storeCash?.code ? "fechar" : "abrir"
      } este caixa?`,
      okText: "Sim",
      okType: "default",
      cancelText: "Não",
      async onOk() {
        if (storeCash?.is_opened) {
          await window.Main.storeCash.closeStoreCash(storeCash?.code, total);

          messageAnt.success("Caixa fechado com sucesso");
          return history.push("/home");
        } else {
          await window.Main.storeCash.openStoreCash(storeCashToOpen, total);
          messageAnt.success("Caixa aberto com sucesso");
          return history.push("/home");
        }
      },
    });
  };

  return (
    <Container
      visible={visible}
      centered
      width={800}
      onCancel={() => setVisible(false)}
      footer={
        <span>
          Valor Total de {storeCash?.is_opened ? "Fechamento" : "Abertura"}: R${" "}
          {currencyFormater(total)}
        </span>
      }
    >
      <Row>
        {amountCash.map((_amount) => (
          <Col sm={12} key={_amount.key}>
            <span>R$ {_amount.label}</span>{" "}
            <Input
              placeholder={_amount.label}
              onChange={({ target: { value } }) =>
                setAmount((oldValue) => ({
                  ...oldValue,
                  [_amount.key]: +value,
                }))
              }
            />
          </Col>
        ))}
      </Row>

      <Row>
        <ButtonRegister onClick={onFinish} isOpened={storeCash?.is_opened}>
          {storeCash?.is_opened ? "REGISTRAR" : "ABRIR CAIXA"}
        </ButtonRegister>
      </Row>
    </Container>
  );
};

export default withRouter(AmountModal);
