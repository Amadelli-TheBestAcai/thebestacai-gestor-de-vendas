import React, { Dispatch, SetStateAction, useState, useEffect } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { useSale } from "../../hooks/useSale";

import amountCash from "../../models/amountCash.json";
import { currencyFormater } from "../../helpers/currencyFormater";

import MonetaryInput from "../../components/MonetaryInput";

import { Input, Modal, notification } from "antd";

import { Container, Row, Col, ButtonRegister } from "./styles";

interface IProp extends RouteComponentProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const AmountModal: React.FC<IProp> = ({ visible, setVisible, history }) => {
  const { storeCash, setStoreCash } = useSale();
  const [loading, setLoaindg] = useState(true);
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
    setLoaindg(true);
    async function init() {
      const hasInternet = await window.Main.hasInternet();
      if (!hasInternet) {
        notification.error({
          message:
            "Para abertura/fechamento de caixa é necessário estar conectado a internet",
          duration: 5,
        });
        setVisible(false);
      }
      setLoaindg(false);
    }
    if (visible) {
      init();
    }
  }, [visible]);

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
      title: `${storeCash?.is_opened ? "Fechamento" : "Abertura"} de caixa`,
      content: `Tem certeza que gostaria de ${storeCash?.is_opened ? "fechar" : "abrir"
        } este caixa?`,
      okText: "Sim",
      okType: "default",
      cancelText: "Não",
      centered: true,
      async onOk() {
        if (storeCash?.is_opened) {
          if (!storeCash?.is_online) {
            notification.error({
              message: "Para fechar o caixa, o mesmo deverá estar Online",
              duration: 5,
            });
            return;
          }

          const {
            has_internal_error: internalErrorOnOnlineIntegrate,
            error_message: errorMessageOnOnlineTntegrate,
          } = await window.Main.sale.onlineIntegration();

          if (internalErrorOnOnlineIntegrate) {
            errorMessageOnOnlineTntegrate
              ? notification.warning({
                  message: errorMessageOnOnlineTntegrate,
                  duration: 5,
                })
              : notification.error({
                  message:
                    errorMessageOnOnlineTntegrate || "Erro ao integrar venda online",
                  duration: 5,
                });
          }

          const {
            has_internal_error: errorOnIntegrateHandler,
            error_message: errorMessageOnIntegrateHandler,
          } = await window.Main.handler.integrateHandler();

          if (errorOnIntegrateHandler) {
            errorMessageOnIntegrateHandler
              ? notification.warning({
                  message: errorMessageOnIntegrateHandler,
                  duration: 5,
                })
              : notification.error({
                  message:
                    errorMessageOnIntegrateHandler || "Erro ao integrar movimentação",
                  duration: 5,
                });
          }

          const {
            has_internal_error: errorOnIntegrateItemOutCart,
            error_message: errorMessageOnIntegrateItemOutCart,
          } = await window.Main.itemOutCart.integrationItemOutCart();

          if (errorOnIntegrateItemOutCart) {
            errorMessageOnIntegrateItemOutCart
              ? notification.warning({
                  message: errorMessageOnIntegrateItemOutCart,
                  duration: 5,
                })
              : notification.error({
                  message:
                    errorMessageOnIntegrateItemOutCart ||
                    "Erro ao integrar itens fora do carrinho",
                  duration: 5,
                });
          }
          const { response: _storeCash, has_internal_error: errorOnStoreCash, error_message: errorMessageCloseStoreCash } =
            await window.Main.storeCash.closeStoreCash(storeCash?.code, total);
          if (errorOnStoreCash) {
            notification.error({
              message: errorMessageCloseStoreCash || "Erro ao fechar o caixa",
              duration: 5,
            });
            return;
          }
          setStoreCash(_storeCash);
          notification.success({
            message: `Caixa ${storeCash?.is_opened ? "fechado" : "aberto"
              } com sucesso!`,
            description: `O caixa foi ${storeCash?.is_opened ? "fechado" : "aberto"
              } com sucesso.`,
            duration: 5,
          });
          return history.push("/home");
        } else {
          const { response: _storeCash, has_internal_error: errorOnStoreCash } =
            await window.Main.storeCash.openStoreCash(total);
          if (errorOnStoreCash) {
            notification.error({
              message: "Erro ao abrir o caixa",
              duration: 5,
            });
            return;
          }
          setStoreCash(_storeCash);
          notification.success({
            message: `Caixa ${storeCash?.is_opened ? "fechado" : "aberto"
              } com sucesso!`,
            description: `O caixa foi ${storeCash?.is_opened ? "fechado" : "aberto"
              } com sucesso.`,
            duration: 5,
          });
          return history.push("/home");
        }
      },
    });
  };

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <Container
          visible={visible}
          centered
          width={800}
          onCancel={() => setVisible(false)}
          footer={
            <span>
              Valor Total de {storeCash?.is_opened ? "Fechamento" : "Abertura"}:{" "}
              <span className="value">R$ {currencyFormater(total)}</span>
            </span>
          }
        >
          <Row>
            {amountCash.map((_amount) => (
              <Col sm={12} key={_amount.key}>
                <span>R$ {_amount.label}</span>{" "}
                <Input
                  type="number"
                  min={0}
                  placeholder={"0"}
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
            <Col sm={12}>
              <span>Valor Cheio</span>
              <MonetaryInput
                autoFocus={true}
                getValue={(value) =>
                  setAmount((oldValues) => ({
                    ...oldValues,
                    fullAmount: +value,
                  }))
                }
              />
            </Col>
          </Row>

          <Row>
            <ButtonRegister onClick={onFinish} isOpened={storeCash?.is_opened}>
              {storeCash?.is_opened ? "REGISTRAR" : "ABRIR CAIXA"}
            </ButtonRegister>
          </Row>
        </Container>
      )}
    </>
  );
};

export default withRouter(AmountModal);
