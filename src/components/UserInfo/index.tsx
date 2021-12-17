import React, { useEffect, useState } from "react";
import MenuAvatar from "../MenuAvatar";
import Spinner from "../Spinner";
import { Dropdown } from "antd";
import { withRouter, RouteComponentProps } from "react-router-dom";
import {
  Store,
  Description,
  UserContent,
  AvatarContent,
  Avatar,
  UserIcon,
  Container,
} from "./styles";

type ComponentProps = RouteComponentProps;

const UserInfo: React.FC<ComponentProps> = ({ history }) => {
  const [store, setStore] = useState<string | undefined>(undefined);
  const [cash, setCash] = useState<string | undefined>("ABERTO");

  useEffect(() => {
    async function init() {
      const registratedStore = await window.Main.store.hasRegistration();
      const storeCash = await window.Main.storeCash.getCurrent();
      setCash(storeCash?.is_online ? "ABERTO" : "FECHADO");
      setStore(registratedStore.company.company_name);
    }
    init();
  }, [history.location]);

  return store && cash ? (
    <Container>
      <UserContent>
        <Store>{store.toUpperCase()}</Store>
        <Description>
          CAIXA:{" "}
          <Description
            style={{
              color: cash === "ABERTO" ? "green" : "red",
            }}
          >
            {cash}
          </Description>
        </Description>
      </UserContent>
      <AvatarContent>
        <Dropdown overlay={MenuAvatar(history)} placement="bottomRight" arrow>
          <Avatar>
            <UserIcon />
          </Avatar>
        </Dropdown>
      </AvatarContent>
    </Container>
  ) : (
    <Spinner />
  );
};

export default withRouter(UserInfo);
