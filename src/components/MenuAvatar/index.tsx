import React from "react";
import {
  Actions,
  LogOutCircleIcon,
  ActionsContent,
  SettingsIcon,
} from "./styles";
import { Menu } from "antd";

const redirect = (history: any, route?: string) => {
  return history.push(`/${route}`);
};

const MenuAvatar = (history: any) => {
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
        {window.Main.user.hasPermission("config.config_access") && (
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
