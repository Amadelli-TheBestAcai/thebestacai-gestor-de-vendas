import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import LogoImg from "../../assets/img/logo-login.png";

import {
  Container,
  LogoContainer,
  Content,
  Logo,
  HomeIcon,
  Listicon,
  CashRegisterIcon,
  RetweetIcon,
  BoxIcon,
  CoinsIcon,
  DeliveryIcon,
  ScrollIcon,
} from "./styles";

type IProps = RouteComponentProps;

const SideBar: React.FC<IProps> = ({ history, location }) => {
  const handleClick = (route: string): void => {
    history.push(route);
  };

  const isRoute = (route: string): boolean => {
    return location.pathname === route;
  };

  return (
    <Container>
      <LogoContainer>
        <Logo src={LogoImg} />
      </LogoContainer>
      <Content>
        <HomeIcon onClick={() => handleClick("/home")} />
        <Listicon onClick={() => handleClick("/command")} />
        <CashRegisterIcon onClick={() => handleClick("/cashier")} />
        <DeliveryIcon onClick={() => handleClick("/delivery")} />
        <RetweetIcon onClick={() => handleClick("/handler")} />
        <BoxIcon onClick={() => handleClick("/stock")} />
        <CoinsIcon onClick={() => handleClick("/sale")} />
        <ScrollIcon onClick={() => handleClick("/nfce")} />
      </Content>
    </Container>
  );
};

export default withRouter(SideBar);
