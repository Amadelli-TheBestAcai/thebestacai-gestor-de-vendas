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
import { useUser } from "../../hooks/useUser";

type IProps = RouteComponentProps;

const SideBar: React.FC<IProps> = ({ history, location }) => {
  const { hasPermission } = useUser();
  const handleClick = (route: string): void => {
    history.push(route);
  };

  const isRoute = (route: string): boolean => {
    return location.pathname === route;
  };

  const tab = () => {
    const response = [];

    response.push(
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
      }
    );

    if (hasPermission("balance.balance_access")) {
      response.push({
        id: 6,
        icon: <ChartIcon />,
        label: "Balanço",
        router: "/balance",
      });
    }

    response.push(
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
      }
    );

    if (hasPermission("config.config_access")) {
      response.push({
        id: 9,
        icon: <SettingsIcon />,
        label: "Configuração",
        router: "/settings",
      });
    }

    response.push({
      id: 10,
      icon: <LogOutIcon />,
      label: "Sair",
      router: "/login",
    });

    return response;
  };

  return (
    <Container>
      <LogoContainer>
        <Logo src={LogoImg} />
      </LogoContainer>
      <Content>
        {tab().map((menu) => (
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
