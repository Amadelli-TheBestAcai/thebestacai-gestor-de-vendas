import React, { useState, useEffect } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import RouterDescription from "../../components/RouterDescription";
import Disconected from "../../components/Disconected";
import Cash from "../../components/StoreCash";
import Spinner from "../../components/Spinner";

import PendingSaleForm from "../../containers/PendingSaleForm";

import { message as messageAnt, Modal } from "antd";

import {
  Container,
  PrimaryContent,
  SecondaryContent,
  CashesContainer,
  Header,
  AmountAction,
  AmountContainer,
  AmountResult,
  BackButton,
  FinishButton,
  Result,
  AmountRow,
  Column,
  AmountLabel,
  AmountInput,
  InputPrice,
  FullAmountColumn,
} from "./styles";

const { confirm } = Modal;

type IProps = RouteComponentProps;

const StoreCash: React.FC<IProps> = ({ history }) => {
  const [loadingCashes, setLoadingCashes] = useState(true);
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [cashes, setCashes] = useState<
    { store_cash: string; available: boolean }[]
  >([]);
  const [loading, setLoading] = useState(false);
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
  const [cash, setCash] = useState<string>();
  const [currentCash, setCurrentCash] = useState<string>();
  const [step, setStep] = useState(1);
  const [total, setTotal] = useState(0);
  const [pendingSale, setPendingSale] = useState<boolean>(false);

  useEffect(() => {
    async function init() {
      const isConnected = await window.Main.hasInternet();
      setIsConnected(isConnected);
      const currentStoreCash = await window.Main.storeCash.getCurrent();
      if (currentStoreCash?.is_opened) {
        setCurrentCash(currentStoreCash?.code);
        setStep(2);
      }
      const availableStoreCashes =
        await window.Main.storeCash.getAvailableStoreCashes();
      setCashes(availableStoreCashes);
      setLoadingCashes(isConnected);
      setLoadingCashes(false);
    }
    init();
  }, []);

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

  const handleState = ({ target: { name, value } }) => {
    if (isNaN(+value)) {
      return;
    }
    setAmount((oldValues) => ({ ...oldValues, [name]: value }));
  };

  const selectCashier = ({ available, store_cash }) => {
    if (!available) {
      return messageAnt.warning("Caixa não disponível");
    }
    setCash(store_cash);
    setStep(2);
  };

  const onFinish = () => {
    confirm({
      title: `${currentCash ? "Fechamento" : "Abertura"} de caixa`,
      content: `Tem certeza que gostaria de ${
        currentCash ? "fechar" : "abrir"
      } este caixa?`,
      okText: "Sim",
      okType: "default",
      cancelText: "Não",
      async onOk() {
        setLoading(true);
        if (currentCash) {
          await window.Main.storeCash.closeStoreCash(currentCash, +total || 0);
          setLoading(false);
          return history.push("/home");
        } else {
          await window.Main.storeCash.openStoreCash(cash, +(total || 0));
          setLoading(false);
          return history.push("/home");
        }
      },
    });
  };

  return (
    <Container>
      <RouterDescription
        description={currentCash ? "Fechamento de Caixa" : "Abertura de Caixa"}
      />
      {loadingCashes ? (
        <Spinner />
      ) : (
        <>
          <>
            {step === 1 && (
              <PrimaryContent>
                {cashes.map((cash) => (
                  <Cash
                    key={cash.store_cash}
                    cash={cash}
                    handleClick={selectCashier}
                  />
                ))}
              </PrimaryContent>
            )}
          </>
          <>
            {step === 2 &&
              (isConnected || !currentCash ? (
                pendingSale && isConnected ? (
                  <PendingSaleForm modalState={pendingSale} cashes={cashes} />
                ) : (
                  <SecondaryContent>
                    <AmountContainer>
                      <AmountRow align="middle" justify="center">
                        <Column span={11}>
                          <AmountLabel>R$ 200,00</AmountLabel>
                          <AmountInput
                            onChange={(event) => handleState(event)}
                            name="twoHundred"
                            value={amount.twoHundred}
                          />
                        </Column>
                        <Column span={11}>
                          <AmountLabel>R$ 100,00</AmountLabel>
                          <AmountInput
                            onChange={(event) => handleState(event)}
                            name="oneHundred"
                            value={amount.oneHundred}
                          />
                        </Column>
                        <Column span={11}>
                          <AmountLabel>R$ 50,00</AmountLabel>
                          <AmountInput
                            onChange={(event) => handleState(event)}
                            name="fifty"
                            value={amount.fifty}
                          />
                        </Column>
                        <Column span={11}>
                          <AmountLabel>R$ 20,00</AmountLabel>
                          <AmountInput
                            onChange={(event) => handleState(event)}
                            name="twenty"
                            value={amount.twenty}
                          />
                        </Column>
                        <Column span={11}>
                          <AmountLabel>R$ 10,00</AmountLabel>
                          <AmountInput
                            onChange={(event) => handleState(event)}
                            name="ten"
                            value={amount.ten}
                          />
                        </Column>
                        <Column span={11}>
                          <AmountLabel>R$ 5,00</AmountLabel>
                          <AmountInput
                            onChange={(event) => handleState(event)}
                            name="five"
                            value={amount.five}
                          />
                        </Column>
                        <Column span={11}>
                          <AmountLabel>R$ 2,00</AmountLabel>
                          <AmountInput
                            onChange={(event) => handleState(event)}
                            name="two"
                            value={amount.two}
                          />
                        </Column>
                        <Column span={11}>
                          <AmountLabel>R$ 1,00</AmountLabel>
                          <AmountInput
                            onChange={(event) => handleState(event)}
                            name="one"
                            value={amount.one}
                          />
                        </Column>
                        <Column span={11}>
                          <AmountLabel>R$ 0,50</AmountLabel>
                          <AmountInput
                            onChange={(event) => handleState(event)}
                            name="fiftyCents"
                            value={amount.fiftyCents}
                          />
                        </Column>
                        <Column span={11}>
                          <AmountLabel>R$ 0,25</AmountLabel>
                          <AmountInput
                            onChange={(event) => handleState(event)}
                            name="twentyFiveCents"
                            value={amount.twentyFiveCents}
                          />
                        </Column>
                        <Column span={11}>
                          <AmountLabel>R$ 0,10</AmountLabel>
                          <AmountInput
                            onChange={(event) => handleState(event)}
                            name="tenCents"
                            value={amount.tenCents}
                          />
                        </Column>
                        <Column span={11}>
                          <AmountLabel>R$ 0,05</AmountLabel>
                          <AmountInput
                            onChange={(event) => handleState(event)}
                            name="fiveCents"
                            value={amount.fiveCents}
                          />
                        </Column>
                        <Column span={11}>
                          <AmountLabel>R$ 0,01</AmountLabel>
                          <AmountInput
                            onChange={(event) => handleState(event)}
                            name="oneCents"
                            value={amount.oneCents}
                          />
                        </Column>
                        <FullAmountColumn span={11}>
                          <AmountLabel>VALOR CHEIO</AmountLabel>
                          <InputPrice
                            autoFocus={true}
                            getValue={(value) =>
                              setAmount((oldValues) => ({
                                ...oldValues,
                                fullAmount: +value,
                              }))
                            }
                          />
                        </FullAmountColumn>
                      </AmountRow>
                    </AmountContainer>
                    <AmountResult>
                      <Result>R$ {total.toFixed(2).replace(".", ",")} </Result>
                    </AmountResult>
                    <AmountAction>
                      {!currentCash && cash && (
                        <BackButton onClick={() => setStep(1)}>
                          Voltar
                        </BackButton>
                      )}
                      <FinishButton
                        onClick={() => onFinish()}
                        loading={loading}
                      >
                        Registrar
                      </FinishButton>
                    </AmountAction>
                  </SecondaryContent>
                )
              ) : (
                <Disconected />
              ))}
          </>
        </>
      )}
    </Container>
  );
};

export default withRouter(StoreCash);
