import React, { useState } from "react";

import CardSettings from "../../components/CardSettings";
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
  InputPortCOM,
  Button,
  ContentButton,
} from "./styles";

import { useSettings } from "../../hooks/useSettings";

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { settings, setSettings } = useSettings();
  const [inputPortCOM, setInputPortCOM] = useState<string>();

  const handleSave = () => {
    Modal.confirm({
      content: "Tem certeza que gostaria de prosseguir?",
      okText: "Sim",
      okType: "default",
      cancelText: "Não",
      centered: true,
      async onOk() {
        setLoading(true);
        const { response: _newSettings, has_internal_error: errorOnSettings } =
          await window.Main.settings.update(settings.id, settings);
        if (errorOnSettings) {
          notification.error({
            message: "Erro ao atualizar as configurações",
            duration: 5,
          });
          return;
        }
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

  const testConnectionBalance = async (portCOM: string) => {
    window.Main.send(
      "balance:testConnection",
      (response) => {
        console.log(response);
        if (response.success) {
          notification.success({
            message: "Sucesso: conexão estabelecida com a balança!",
            duration: 5,
          });
        } else {
          notification.warning({
            message: response.message,
            duration: 5,
          });
        }
      },
      portCOM
    );
  };

  return (
    <Container>
      <PageContent>
        <Header>
          <h2>Configurações</h2>
        </Header>
        <CardSettings title="Integração de Balança">
          <SelectsContainer>
            <InputPortCOM
              disabled={!settings.should_use_balance}
              defaultValue={settings.balance_port?.replace(/\D/g, "")}
              type="number"
              prefix={"COM"}
              min={0}
              max={99}
              onChange={(value) => {
                const balance_port = "COM" + parseInt(value.target.value);
                setSettings((oldValues) => ({
                  ...oldValues,
                  balance_port: balance_port,
                }));
                setInputPortCOM(balance_port);
              }}
              placeholder={"Porta da balança"}
            />
          </SelectsContainer>

          <ContentButton>
            <Button
              hidden={!settings.should_use_balance}
              onClick={() => {
                let portCOM = inputPortCOM
                  ? inputPortCOM
                  : "COM" + settings.balance_port?.replace(/\D/g, "");
                testConnectionBalance(portCOM);
              }}
            >
              Testar conexão
            </Button>
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
          </ContentButton>
        </CardSettings>

        <CardSettings title="Integração de Impressora">
          <SelectsContainer>
            <Select
              disabled={!settings.should_use_printer}
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
              checked={settings.should_use_printer}
              onChange={() =>
                setSettings((oldValues) => ({
                  ...oldValues,
                  should_use_printer: !settings.should_use_printer,
                }))
              }
            />
            <span>
              {!settings.should_use_printer ? "DESABILITADO" : "HABILITADO"}
            </span>
          </ActionContainer>
        </CardSettings>

        <CardSettings title="Emissão de nfce por venda">
          <span style={{ padding: "2%" }}>
            Ao habilitar, a cada venda feita sera feito uma tentativa de emissão
            de nota fiscal.
          </span>
          <ActionContainer>
            <Switch
              checked={settings.should_emit_nfce_per_sale}
              onChange={() =>
                setSettings((oldValues) => ({
                  ...oldValues,
                  should_emit_nfce_per_sale:
                    !settings.should_emit_nfce_per_sale,
                }))
              }
            />
            <span>
              {!settings.should_emit_nfce_per_sale
                ? "DESABILITADO"
                : "HABILITADO"}
            </span>
          </ActionContainer>
        </CardSettings>

        <CardSettings title="Impressão de cupom por venda">
          <span style={{ padding: "2%" }}>
            Ao habilitar, a cada venda feita sera feito a impressão do cupom.
          </span>
          <ActionContainer>
            <Switch
              checked={settings.should_print_sale}
              onChange={() =>
                setSettings((oldValues) => ({
                  ...oldValues,
                  should_print_sale: !settings.should_print_sale,
                }))
              }
            />
            <span>
              {!settings.should_print_sale ? "DESABILITADO" : "HABILITADO"}
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
