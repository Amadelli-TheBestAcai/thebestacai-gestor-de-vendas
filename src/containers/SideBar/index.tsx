import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import {
  Container,
  Command,
  Cash,
  Delivery,
  ArrowIcon,
  Graph,
  Money,
  Home,
  IconContainer,
  BoxIcon,
  NfceIcon,
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
      <IconContainer
        style={{ background: isRoute("/home") ? "#FF9D0A" : "black" }}
      >
        <Home
          style={{ color: isRoute("/home") ? "black" : "#FF9D0A" }}
          onClick={() => handleClick("/home")}
        />
      </IconContainer>
      <IconContainer
        style={{ background: isRoute("/command") ? "#FF9D0A" : "black" }}
      >
        <Command
          style={{ color: isRoute("/command") ? "black" : "#FF9D0A" }}
          onClick={() => handleClick("/command")}
        />
      </IconContainer>
      <IconContainer
        style={{ background: isRoute("/store-cash") ? "#FF9D0A" : "black" }}
      >
        <Cash
          style={{ color: isRoute("/store-cash") ? "black" : "#FF9D0A" }}
          onClick={() => handleClick("/store-cash")}
        />
      </IconContainer>
      <IconContainer
        style={{ background: isRoute("/delivery") ? "#FF9D0A" : "black" }}
      >
        <Delivery
          style={{ color: isRoute("/delivery") ? "black" : "#FF9D0A" }}
          onClick={() => handleClick("/delivery")}
        />
      </IconContainer>
      <IconContainer
        style={{ background: isRoute("/handler") ? "#FF9D0A" : "black" }}
      >
        <ArrowIcon
          style={{ color: isRoute("/handler") ? "black" : "#FF9D0A" }}
          onClick={() => handleClick("/handler")}
        />
      </IconContainer>
      <IconContainer
        style={{ background: isRoute("/stock") ? "#FF9D0A" : "black" }}
      >
        <BoxIcon
          style={{ color: isRoute("/stock") ? "black" : "#FF9D0A" }}
          onClick={() => handleClick("/stock")}
        />
      </IconContainer>
      {window.Main.user.hasPermission("balance.balance_access") && (
        <IconContainer
          style={{ background: isRoute("/balance") ? "#FF9D0A" : "black" }}
        >
          <Graph
            style={{ color: isRoute("/balance") ? "black" : "#FF9D0A" }}
            onClick={() => handleClick("/balance")}
          />
        </IconContainer>
      )}
      <IconContainer
        style={{ background: isRoute("/sale") ? "#FF9D0A" : "black" }}
      >
        <Money
          style={{ color: isRoute("/sale") ? "black" : "#FF9D0A" }}
          onClick={() => handleClick("/sale")}
        />
      </IconContainer>

      <IconContainer
        style={{ background: isRoute("/nfce") ? "#FF9D0A" : "black" }}
      >
        <NfceIcon
          style={{ color: isRoute("/nfce") ? "black" : "#FF9D0A" }}
          onClick={() => handleClick("/nfce")}
        />
      </IconContainer>
    </Container>
  );
};

export default withRouter(SideBar);
