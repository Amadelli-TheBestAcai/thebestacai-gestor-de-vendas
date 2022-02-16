import React, { useState, useEffect } from "react";

import CardSettings from "../../components/CardSettings";
import Spinner from "../../components/Spinner";

import { Modal, notification } from "antd";
import {
  Container,
  PageContent,
  Header,
  Footer,
  ButtonSave,
  ActionContainer,
  Option,
  Select,
  SelectsContainer,
  Switch,
} from "./styles";

import { useSettings } from "../../hooks/useSettings";

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { settings, setSettings } = useSettings();

  const ports = ["COM1", "COM2", "COM3", "COM4", "COM5"];

  const handleSave = () => {
    Modal.confirm({
      content: "Tem certeza que gostaria de prosseguir?",
      okText: "Sim",
      okType: "default",
      cancelText: "Não",
      centered: true,
      async onOk() {
        setLoading(true);
        const _newSettings = await window.Main.settings.update(
          settings.id,
          settings
        );
        setSettings(_newSettings);
        notification.success({
          message: "Configurações salvas com sucesso!",
          description: "As configurações foram salvas com sucesso",
          duration: 5,
        });
        setLoading(false);
      },
    });
  };
  return (
    <Container>
      <PageContent>
        <Header>
          <h2>Configurações</h2>
        </Header>
        <CardSettings title="Integração de Balança">
          <SelectsContainer>
            <Select
              disabled={!settings.should_use_balance}
              placeholder="Porta da balança"
              value={settings.balance_port}
              onChange={(balance_port) =>
                setSettings((oldValues) => ({
                  ...oldValues,
                  balance_port: balance_port.toString(),
                }))
              }
            >
              {ports.map((port) => (
                <Option key={port}>{port}</Option>
              ))}
            </Select>
          </SelectsContainer>

          <ActionContainer>
            <Switch
              checked={settings.should_use_balance}
              onChange={() =>
                setSettings((oldValues) => ({
                  ...oldValues,
                  should_use_balance: !settings.should_use_balance,
                }))
              }
            />
            <span>
              {!settings.should_use_balance ? "DESABILITADO" : "HABILITADO"}
            </span>
          </ActionContainer>
        </CardSettings>

        <CardSettings title="Integração de Impressora">
          <SelectsContainer>
            <Select
              disabled={!settings.should_use_balance}
              placeholder="Impressora"
              value={settings.printer}
              onChange={(printer) =>
                setSettings((oldValues) => ({
                  ...oldValues,
                  printer: printer.toString(),
                }))
              }
            >
              {window.Main.settings.getPrinters().map((printer) => (
                <Option key={printer}>{printer}</Option>
              ))}
            </Select>
          </SelectsContainer>
          <ActionContainer>
            <Switch
              checked={settings.should_use_balance}
              onChange={() =>
                setSettings((oldValues) => ({
                  ...oldValues,
                  should_use_balance: !settings.should_use_balance,
                }))
              }
            />
            <span>
              {!settings.should_use_balance ? "DESABILITADO" : "HABILITADO"}
            </span>
          </ActionContainer>
        </CardSettings>

        <Footer>
          <ButtonSave onClick={handleSave} loading={loading}>
            Salvar
          </ButtonSave>
        </Footer>
      </PageContent>
    </Container>
  );
};

export default Settings;
