import React, { useState, useEffect } from "react";

import DisconectedForm from "../../containers/DisconectedForm";

import RouterDescription from "../../components/RouterDescription";
import Spinner from "../../components/Spinner";

import { Balance as BalanceModel } from "../../models/balance";

import PixLogo from "../../assets/svg/pix.svg";

import {
  Container,
  CardContainer,
  Card,
  CardHeader,
  CardBody,
  CardRow,
  Description,
  CardFooter,
  Title,
  MoneyIcon,
  CreditIcon,
  DebitIcon,
  TicketIcon,
  CardContent,
  CheckOnline,
} from "./styles";

const Balance: React.FC = () => {
  const [isConected, setIsConected] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [balance, setBalance] = useState<BalanceModel>();

  useEffect(() => {
    async function init() {
      const isConnected = await window.Main.hasInternet();
      const _storeCash = await window.Main.storeCash.getStoreCashBalance();
      setBalance(_storeCash);
      setLoading(false);
      setIsConected(isConnected);
    }
    init();
  }, []);

  return (
    <Container>
      <RouterDescription description="Balanço" />
      {isLoading ? (
        <Spinner />
      ) : isConected ? (
        <CardContainer>
          <Card>
            <CardHeader>DELIVERY</CardHeader>
            <CardBody>
              <CardRow style={{ background: "#4356FF", width: "100%" }}>
                <Title>
                  R$ {balance.delivery.total.toFixed(2).replace(".", ",")}
                </Title>
              </CardRow>
              <CardRow>
                <MoneyIcon />
                <CardContent>
                  R$ {balance.delivery.money.toFixed(2).replace(".", ",")}
                  <Description>Dinheiro</Description>
                </CardContent>
              </CardRow>
              <CardRow>
                <CreditIcon />
                <CardContent>
                  R$ {balance.delivery.credit.toFixed(2).replace(".", ",")}
                  <Description>Crédito</Description>
                </CardContent>
              </CardRow>
              <CardRow>
                <DebitIcon />
                <CardContent>
                  R$ {balance.delivery.debit.toFixed(2).replace(".", ",")}
                  <Description>Débito</Description>
                </CardContent>
              </CardRow>
              <CardRow>
                <img
                  src={PixLogo}
                  style={{
                    width: "3vw",
                    height: "5vh",
                    margin: "0% 7% 0% 13%",
                  }}
                />
                <CardContent>
                  R$ {balance.delivery.pix.toFixed(2).replace(".", ",")}
                  <Description>PIX</Description>
                </CardContent>
              </CardRow>
              <CardRow>
                <CheckOnline />
                <CardContent>
                  R$ {balance.delivery.online.toFixed(2).replace(".", ",")}
                  <Description>Online</Description>
                </CardContent>
              </CardRow>
            </CardBody>
            <CardFooter />
          </Card>
          <Card>
            <CardHeader style={{ background: "#007305" }}>LOJA</CardHeader>
            <CardBody green>
              <CardRow style={{ background: "#058A0A", width: "100%" }}>
                <Title>
                  R$ {balance.store.total.toFixed(2).replace(".", ",")}
                </Title>
              </CardRow>
              <CardRow green>
                <MoneyIcon />
                <CardContent>
                  R$ {balance.store.money.toFixed(2).replace(".", ",")}
                  <Description>Dinheiro</Description>
                </CardContent>
              </CardRow>
              <CardRow green>
                <CreditIcon />
                <CardContent>
                  R$ {balance.store.credit.toFixed(2).replace(".", ",")}
                  <Description>Crédito</Description>
                </CardContent>
              </CardRow>
              <CardRow green>
                <DebitIcon />
                <CardContent>
                  R$ {balance.store.debit.toFixed(2).replace(".", ",")}
                  <Description>Débito</Description>
                </CardContent>
              </CardRow>
              <CardRow green>
                <img
                  src={PixLogo}
                  style={{
                    width: "3vw",
                    height: "5vh",
                    margin: "0% 7% 0% 13%",
                  }}
                />
                <CardContent>
                  R$ {balance.store.pix.toFixed(2).replace(".", ",")}
                  <Description>PIX</Description>
                </CardContent>
              </CardRow>
              <CardRow green>
                <TicketIcon />
                <CardContent>
                  R$ {balance.store.ticket.toFixed(2).replace(".", ",")}
                  <Description>Ticket</Description>
                </CardContent>
              </CardRow>
            </CardBody>
            <CardFooter green />
          </Card>
          <Card>
            <CardHeader style={{ background: "#FF9D0A" }}>
              FATURAMENTO
            </CardHeader>
            <CardBody black fontWhite>
              <CardRow style={{ background: "#FF9D0A", width: "100%" }}>
                <Title>
                  R$ {balance.billing.total.toFixed(2).replace(".", ",")}
                </Title>
              </CardRow>
              <CardRow black>
                <CardContent>
                  <Description white>VENDAS</Description>
                  {balance.billing.sales}
                </CardContent>
              </CardRow>
              <CardRow black>
                <CardContent>
                  <Description white>VENDAS DELIVERY</Description>
                  {balance.billing.delivery_sales}
                </CardContent>
              </CardRow>
              <CardRow black>
                <CardContent>
                  <Description white>VENDAS LOJA</Description>
                  {balance.billing.store_sales}
                </CardContent>
              </CardRow>
              <CardRow black>
                <CardContent>
                  <Description white>TICKET MÉDIO DELIVERY</Description>
                  R${" "}
                  {balance.billing.delivery_ticket.toFixed(2).replace(".", ",")}
                </CardContent>
              </CardRow>
              <CardRow black>
                <CardContent>
                  <Description white>TICKET MÉDIO LOJA</Description>
                  R$ {balance.billing.store_ticket.toFixed(2).replace(".", ",")}
                </CardContent>
              </CardRow>
            </CardBody>
            <CardFooter black />
          </Card>
        </CardContainer>
      ) : (
        <DisconectedForm />
      )}
    </Container>
  );
};

export default Balance;
