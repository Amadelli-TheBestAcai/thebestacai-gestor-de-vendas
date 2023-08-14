import React, { useEffect, useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import LogoImg from "../../assets/img/logo-login.png";

import { Modal, Tooltip } from "antd";

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
import { useUser } from "../../hooks/useUser";
import { useIfood } from "../../hooks/useIfood";

type IProps = RouteComponentProps;

const SideBar: React.FC<IProps> = ({ history }) => {
  const [visible, setVisible] = useState(false);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const { ifood } = useIfood();

  const { hasPermission } = useUser();

  useEffect(() => {
    if (ifood?.new_orders !== undefined) {
      setNewOrderCount(ifood.new_orders);
      setShowNotification(ifood.new_orders > 0);
    } else {
      setNewOrderCount(0);
      setShowNotification(false);
    }
  }, [ifood]);

  const handleClick = (id: number, route: string): void => {
    history.push(route);

    if (id === 10) {
      Modal.confirm({
        title: `Logout`,
        content: `Tem certeza que gostaria de sair`,
        visible: visible,
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
        icon: (
          <div style={{ position: "relative" }}>
            <DeliveryIcon />
            {newOrderCount > 0 && (
              <div className="notification-badge">{newOrderCount}</div>
            )}
          </div>
        ),
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

    const deliveryMenu = response.find((menu) => menu.id === 3);

    if (deliveryMenu && showNotification) {
      deliveryMenu.icon = (
        <div style={{ position: "relative" }}>
          <DeliveryIcon />
          <div className="notification-badge">{ifood?.new_orders}</div>
        </div>
      );
    }

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
