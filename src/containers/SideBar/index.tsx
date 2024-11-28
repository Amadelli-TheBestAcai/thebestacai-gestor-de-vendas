import React, { useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import { useUser } from "../../hooks/useUser";
import { useSale } from "../../hooks/useSale";

import LogoImg from "../../assets/img/logo-login.png";

import { Modal, Tooltip, notification } from "antd";

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
  TrashIcon,
} from "./styles";

type IProps = RouteComponentProps;

const SideBar: React.FC<IProps> = ({ history }) => {
  const { hasPermission } = useUser();

  const handleClick = async (id: number, route: string) => {
    const isConnected = await window.Main.hasInternet();

    if (route === "/handler" || route === "/sale") {
      const { response: storeCash } = await window.Main.storeCash.getCurrent();
      if (!storeCash?.is_online) {
        notification.info({
          message: "Caixa offline",
          description: `O caixa deve estar online para acessar a tela de ${
            route === "/handler" ? "Movimentações" : "Vendas"
          }`,
          duration: 3,
        });
      } else if (!isConnected) {
        notification.info({
          message: "Sem acesso a internet",
          description: `Você está sem conexão com a internet para realizar o acesso a tela de ${
            route === "/handler" ? "Movimentações" : "Vendas"
          }`,
          duration: 3,
        });
      } else {
        history.push(route);
      }
    } else {
      history.push(route);
    }

    if (id === 10) {
      Modal.confirm({
        title: `Logout`,
        content: `Tem certeza que gostaria de sair`,
        okText: "Sim",
        okType: "default",
        cancelText: "Não",
        centered: true,
        async onOk() {
          history.push("/login");
        },
      });
    }
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
      },
      {
        id: 9,
        icon: <TrashIcon />,
        label: "Desperdícios",
        router: "/waste",
      }
    );

    if (hasPermission("config.config_access")) {
      response.push({
        id: 11,
        icon: <SettingsIcon />,
        label: "Configuração",
        router: "/settings",
      });
    }

    response.push({
      id: 10,
      icon: <LogOutIcon />,
      label: "Sair",
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
            <CardIcon
              onClick={() => {
                handleClick(menu.id, menu.router);
              }}
            >
              {menu.icon}
            </CardIcon>
          </Tooltip>
        ))}
      </Content>
    </Container>
  );
};

export default withRouter(SideBar);
