import React, { useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import CardSettings from "../../components/CardSettings";
import { Modal, notification, Tooltip } from "antd";

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
  InfoIcon,
  ButtonSaveStore,
  StoreChange,
} from "./styles";

import { useSettings } from "../../hooks/useSettings";
import { useStore } from "../../hooks/useStore";
import { useSale } from "../../hooks/useSale";

type IProps = RouteComponentProps;

const Settings: React.FC<IProps> = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [loadingConfigurationTef, setLoadingConfigurationTef] = useState(false);
  const { settings, setSettings } = useSettings();
  const { setStore } = useStore();
  const { storeCash } = useSale();
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

  const changeStore = () => {
    Modal.confirm({
      content: "Tem certeza que gostaria de trocar a loja?",
      okText: "Sim",
      okType: "default",
      cancelText: "Não",
      centered: true,
      async onOk() {
        setLoading(true);
        const { has_internal_error } = await window.Main.store.remove();

        if (has_internal_error) {
          notification.error({
            message: "Erro ao iniciar alteração da loja",
            duration: 5,
          });
          return;
        }

        setStore(null);

        notification.success({
          message: "Desvinculação da loja realizada com sucesso",
          description:
            "Para selecionar a nova loja, realize o login novamente.",
          duration: 5,
        });

        setLoading(false);

        return history.push("/login");
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

  const configurationTEF = async () => {
    setLoadingConfigurationTef(true);
    const { response, has_internal_error, error_message } =
      await window.Main.tefFactory.configurationTEF();
    if (has_internal_error) {
      notification.error({
        message: "Error ao tentar configurar TEF",
        duration: 5,
      });
      setLoadingConfigurationTef(false);
      return;
    }
    setLoadingConfigurationTef(false);
  };

  return (
    <Container>
      <Header>
        <h2>Configurações</h2>
      </Header>
      <PageContent>
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
                  should_print_nfce_per_sale: settings.should_emit_nfce_per_sale
                    ? settings.should_print_nfce_per_sale
                    : false,
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

        {settings.should_emit_nfce_per_sale && (
          <CardSettings title="Impressão automática da DANFE">
            <span style={{ padding: "2%" }}>
              Ao habilitar, será impresso automaticamente a DANFE a cada nota
              fiscal emitida com sucesso ao finalizar venda.
            </span>
            <ActionContainer>
              <Switch
                checked={settings.should_print_nfce_per_sale}
                onChange={() =>
                  setSettings((oldValues) => ({
                    ...oldValues,
                    should_print_nfce_per_sale:
                      !settings.should_print_nfce_per_sale,
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
        )}

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

        <CardSettings title="Alterar loja">
          <StoreChange>
            <span className="descriptionStore">
              Ao solicitar a alteração de loja, será necessário refazer o login.
            </span>
            {storeCash?.is_opened && (
              <span className="storeObservation">
                Para alterar a loja é necessário que o caixa esteja fechado
              </span>
            )}
          </StoreChange>
          {storeCash?.is_opened ? (
            <Tooltip title="Para alterar a loja é necessário que o caixa esteja fechado">
              <ButtonSaveStore
                onClick={changeStore}
                loading={loading}
                disabled={storeCash?.is_opened}
                style={{ color: "gray" }}
              >
                Alterar Loja
              </ButtonSaveStore>
            </Tooltip>
          ) : (
            <ButtonSaveStore
              onClick={changeStore}
              loading={loading}
              disabled={storeCash?.is_opened}
              style={{ color: "white" }}
            >
              Alterar
            </ButtonSaveStore>
          )}
        </CardSettings>

        <CardSettings title="Configuração TEF">
          <ContentButton>
            <Button
              hidden={!settings.should_use_tef}
              loading={loadingConfigurationTef}
              onClick={() => {
                configurationTEF();
              }}
            >
              Configurar TEF
            </Button>
            <span style={{ marginLeft: "1rem" }}>
              {settings.should_use_tef
                ? `Número PDV: ${storeCash.store_id}`
                : ""}
            </span>
          </ContentButton>
          <ActionContainer>
            <Switch
              checked={settings.should_use_tef}
              onChange={() =>
                setSettings((oldValues) => ({
                  ...oldValues,
                  should_use_tef: !settings.should_use_tef,
                }))
              }
            />
            <span>
              {!settings.should_use_tef ? "DESABILITADO" : "HABILITADO"}
            </span>
          </ActionContainer>
        </CardSettings>
      </PageContent>

      <Footer>
        <ButtonSave onClick={handleSave} loading={loading}>
          Salvar
        </ButtonSave>
      </Footer>
    </Container>
  );
};

export default withRouter(Settings);
