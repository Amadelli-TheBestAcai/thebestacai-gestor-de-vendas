import React, { useEffect, useState } from "react";

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
} from "./styles";

import { useSettings } from "../../hooks/useSettings";

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { settings, setSettings } = useSettings();

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
              type="number"
              onChange={(value) =>
                setSettings((oldValues) => ({
                  ...oldValues,
                  balance_port: 'COM' + value.target.value,
                })
                )
              }
              placeholder={settings.balance_port !== "" ? settings.balance_port : "Porta da balança"}
            />
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
              {!settings.should_use_printer ? "DESABILITADO" : "HABILITADO"}
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
