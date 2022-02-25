import React from "react";
import {
  Actions,
  LogOutCircleIcon,
  ActionsContent,
  SettingsIcon,
} from "./styles";
import { Menu } from "antd";
import { useUser } from "../../hooks/useUser";

const redirect = (history: any, route?: string) => {
  return history.push(`/${route}`);
};

const MenuAvatar = (history: any) => {
  const { hasPermission } = useUser();
  return (
    <Menu>
      <Menu.Item>
        <ActionsContent
          onClick={() => {
            redirect(history, "login");
          }}
        >
          <LogOutCircleIcon />
          <Actions>Log out</Actions>
        </ActionsContent>
        {hasPermission("config.config_access") && (
          <ActionsContent
            onClick={() => {
              redirect(history, "settings");
            }}
          >
            <SettingsIcon />
            <Actions>Configurações</Actions>
          </ActionsContent>
        )}
      </Menu.Item>
    </Menu>
  );
};
export default MenuAvatar;
