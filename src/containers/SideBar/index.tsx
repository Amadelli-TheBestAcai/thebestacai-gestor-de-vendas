import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import LogoImg from "../../assets/img/logo-login.png";

import { Tooltip } from "antd";

import {
  Container,
  LogoContainer,
  Content,
  Logo,
  HomeIcon,
  CashRegisterIcon,
  RetweetIcon,
  BoxIcon,
  CoinsIcon,
  DeliveryIcon,
  ScrollIcon,
  CardIcon,
  ChartIcon,
  SettingsIcon,
  LogOutIcon,
} from "./styles";

type IProps = RouteComponentProps;

const SideBar: React.FC<IProps> = ({ history }) => {
  const handleClick = (route: string): void => {
    history.push(route);
  };

  const menus = [
    {
      id: 1,
      icon: <HomeIcon />,
      label: "Página Inicial",
      router: "/home",
    },
    {
      id: 2,
      icon: <CashRegisterIcon />,
      label: "Gerenciamento de Caixa",
      router: "/store-cash",
    },
    {
      id: 3,
      icon: <DeliveryIcon />,
      label: "Delivery",
      router: "/delivery",
    },
    {
      id: 4,
      icon: <RetweetIcon />,
      label: "Movimentações",
      router: "/handler",
    },
    {
      id: 5,
      icon: <BoxIcon />,
      label: "Estoque",
      router: "/stock",
    },
    {
      id: 6,
      icon: <ChartIcon />,
      label: "Balanço",
      router: "/balance",
    },
    {
      id: 7,
      icon: <CoinsIcon />,
      label: "Vendas",
      router: "/sale",
    },
    {
      id: 8,
      icon: <ScrollIcon />,
      label: "NFC-e",
      router: "/nfce",
    },
    {
      id: 9,
      icon: <SettingsIcon />,
      label: "Configuração",
      router: "/settings",
    },
    {
      id: 10,
      icon: <LogOutIcon />,
      label: "Sair",
      router: "/login",
    },
  ];

  return (
    <Container>
      <LogoContainer>
        <Logo src={LogoImg} />
      </LogoContainer>
      <Content>
        {menus.map((menu) => (
          <Tooltip
            key={menu.id}
            placement="right"
            title={menu.label}
            color={"var(--orange-250)"}
          >
            <CardIcon onClick={() => handleClick(menu.router)}>
              {menu.icon}
            </CardIcon>
          </Tooltip>
        ))}
      </Content>
    </Container>
  );
};

export default withRouter(SideBar);
