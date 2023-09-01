import React, { useState, useEffect } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import LogoImg from "../../assets/img/logo-login.png";
import Spinner from "../../components/Spinner";
import { StoreDto } from "../../models/dtos/store";
import { useSettings } from "../../hooks/useSettings";
import { useUser } from "../../hooks/useUser";
import { useStore } from "../../hooks/useStore";

import { Form, Select, notification, Modal, Row, Progress } from "antd";

import {
  Container,
  LeftContent,
  RightContent,
  Footer,
  FormContainer,
  LogoContainer,
  Logo,
  FormContent,
  Input,
  ActionsContainer,
  LoginButton,
  ContactInfo,
  BackButton,
  Checkbox,
  ButtonSave,
  TextModalVersion,
} from "./styles";

const Option = Select;

type IProps = RouteComponentProps;

const Login: React.FC<IProps> = ({ history }) => {
  const { setUser: setContextUser } = useUser();
  const { setStore: setContextStore, store: storeContext } = useStore();
  const { settings, setSettings } = useSettings();
  const [user, setUser] = useState({
    username: settings.should_remember_user ? settings.rememberd_user : "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState("");
  const [step, setStep] = useState<number>(1);
  const [store, setStore] = useState<number | undefined>(undefined);
  const [stores, setStores] = useState<StoreDto[]>([]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [typeInput, setTypeInput] = useState<string>("password");
  const [shouldApplyMandatoryVersion, setShouldApplyMandatoryVersion] =
    useState(false);
  const [percentDownloaded, setPercentDownloaded] = useState<number>(0);
  const [shouldShowUpdateModal, setShouldShowUpdateModal] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    async function init() {
      window.Main.send("app_version", async (pkg_version) => {
        setVersion(pkg_version);
        const { response, has_internal_error: errorOnGetVersion } =
          await window.Main.common.checkForUpdates(pkg_version);

        if (errorOnGetVersion) {
          notification.error({
            message: "Falha ao verificar atualizações para o sistema",
            duration: 5,
          });
        } else {
          if (response.has_update) {
            setShouldShowUpdateModal(true);

            if (response.is_mandatory) {
              setShouldApplyMandatoryVersion(true);
            }
            window.Main.message("check_for_update");
            window.Main.on("download-progress", (percent) => {
              console.log({ percent: percent.slice(0, 2) });
              setPercentDownloaded(+percent.slice(0, 2));
            });
          }
        }
        form.setFieldsValue({
          username: settings.should_remember_user
            ? settings.rememberd_user
            : "",
        });
        setLoading(false);
      });
    }
    init();
  }, []);

  const handleState = ({ target: { name, value } }: any) =>
    setUser((oldValues) => ({ ...oldValues, [name]: value }));

  const onLogin = async () => {
    setLoading(true);
    const {
      response: loggedUser,
      has_internal_error: error,
      error_message,
    } = await window.Main.user.login(user.username, user.password);

    if (error) {
      notification.error({
        message: error_message,
        duration: 5,
      });
      setLoading(false);
      return;
    }
    if (loggedUser) {
      setContextUser(loggedUser);

      const { response: updatedSettings, has_internal_error: errorOnSettings } =
        await window.Main.settings.update(settings.id, {
          ...settings,
          rememberd_user: settings.should_remember_user ? user.username : "",
          should_open_casher: true,
        });
      if (errorOnSettings) {
        notification.error({
          message: "Erro ao atualizar as configurações",
          duration: 5,
        });
        return;
      }

      setSettings(updatedSettings);

      if (storeContext) {
        setLoading(false);
        window.Main.message("balance:connect");

        await window.Main.product.getProducts();
        await window.Main.product.getAllPurchaseProducts(false);

        return history.push("/home");
      } else {
        const { response: stores, has_internal_error: errorOnStore } =
          await window.Main.store.getFromApi();
        if (errorOnStore) {
          notification.error({
            message: "Erro ao encontrar loja",
            duration: 5,
          });
          return;
        }
        setStores(stores);
        setLoading(false);
        setStep(2);
      }
    } else {
      notification.error({
        message: "Credenciais inválidas",
        duration: 5,
      });
      setLoading(false);
    }
  };

  const registerStore = async () => {
    if (!store) {
      notification.warning({
        message: "Selecione uma loja",
        duration: 5,
      });
      return;
    }
    const storeToRegister = stores.find(
      (_store) => _store.company.id === store
    );
    const { response: _store, has_internal_error: errorOnStore } =
      await window.Main.store.create(storeToRegister);

    if (errorOnStore) {
      notification.error({
        message: "Erro ao registrar a loja",
        duration: 5,
      });
      return;
    }
    setContextStore(_store);
    window.Main.message("balance:connect");
    await window.Main.product.getAllPurchaseProducts(false);
    await window.Main.product.getProducts();
    return history.push("/home");
  };

  const viewPassword = () => {
    setShowPassword(!showPassword);
    if (showPassword) {
      setTypeInput("text");
    } else {
      setTypeInput("password");
    }
  };

  const rememberUserHandler = async () => {
    const { response: _updatedSettings, has_internal_error: errorOnSettings } =
      await window.Main.settings.update(settings.id, {
        ...settings,
        should_remember_user: !settings.should_remember_user,
      });
    if (errorOnSettings) {
      notification.error({
        message: "Erro ao atualizar as configurações",
        duration: 5,
      });
      return;
    }
    setSettings(_updatedSettings);
  };

  return (
    <Container>
      {settings ? (
        <>
          <LeftContent />

          <RightContent>
            <LogoContainer>
              <Logo src={LogoImg} />
            </LogoContainer>

            <FormContainer>
              <FormContent>
                <h3>{step === 1 ? "Gestor de Vendas" : "Defina sua loja"}</h3>
                <p>
                  {step === 1
                    ? "Insira seu usuário e senha para conectar"
                    : "Selecione uma loja para continuar o login"}
                </p>
                <Form
                  form={form}
                  onFinish={step === 1 ? onLogin : registerStore}
                  layout="vertical"
                >
                  {step === 1 ? (
                    <>
                      <Form.Item
                        label="Usuário"
                        name="username"
                        rules={[
                          { required: true, message: "Campo obrigatório" },
                        ]}
                      >
                        <Input
                          name="username"
                          placeholder="Digite seu usuário"
                          onChange={(event) => handleState(event)}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Senha"
                        name="password"
                        rules={[
                          { required: true, message: "Campo obrigatório" },
                        ]}
                      >
                        <Input
                          name="password"
                          placeholder="Digite sua senha"
                          type={typeInput}
                          onChange={(event) => handleState(event)}
                        />
                      </Form.Item>
                    </>
                  ) : (
                    <>
                      <Form.Item
                        label="Loja"
                        style={{ fontSize: "14px" }}
                        name="store"
                        rules={[
                          { required: true, message: "Selecione a Loja" },
                        ]}
                      >
                        <Select
                          onChange={(value) => setStore(+value)}
                          placeholder="Selecione uma loja"
                          optionFilterProp="children"
                          showSearch
                          filterOption={(input, option) =>
                            option?.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {stores.map((store) => (
                            <Option key={store.company_id}>
                              {store.company.company_name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <ActionsContainer>
                        <div className="remember_user">
                          <Checkbox
                            checked={settings.should_remember_user}
                            onChange={rememberUserHandler}
                          />
                          Lembrar usuário
                        </div>

                        <a onClick={() => viewPassword()}>Mostrar senha</a>
                      </ActionsContainer>
                    </>
                  )}

                  <LoginButton htmlType="submit" loading={loading}>
                    Entrar
                  </LoginButton>

                  {step === 2 && (
                    <>
                      <BackButton onClick={() => setStep(1)}>Voltar</BackButton>
                    </>
                  )}
                </Form>

                <ContactInfo>
                  <p>
                    Está com problemas para acessar? Entre em contato <br />{" "}
                    conosco
                    <span> comunicathebestacai@gmail.com</span>.
                  </p>
                </ContactInfo>
              </FormContent>
            </FormContainer>

            <Footer>
              <span>Developed by The Best Açai Company v {version}</span>
            </Footer>
          </RightContent>
        </>
      ) : (
        <Spinner />
      )}
      <Modal
        title="Atualização do APP"
        footer={null}
        visible={shouldApplyMandatoryVersion}
        closable={false}
      >
        <Row>
          Instalando nova versão do APP, ao finalizar, o APP será
          automaticamente reiniciado.
        </Row>
        <Row justify="center">
          <Progress percent={+percentDownloaded} />
        </Row>
      </Modal>

      <Modal
        title="Nova versão disponível!"
        centered
        visible={shouldShowUpdateModal}
        closable={false}
        destroyOnClose={true}
        footer={
          <Footer>
            <ButtonSave
              onClick={() => setShouldShowUpdateModal(false)}
              disabled={!isCheckboxChecked}
            >
              Fechar
            </ButtonSave>
          </Footer>
        }
      >
        <TextModalVersion>
          Seu Gestor de Vendas está <b>desatualizado</b>, o que pode resultar em
          mau funcionamento e vulnerabilidades de segurança.
          <span>Entre em contato com o suporte para atualiza-lo.</span>
        </TextModalVersion>
        <Checkbox
          checked={isCheckboxChecked}
          onChange={(e) => setIsCheckboxChecked(e.target.checked)}
        />
        Li e estou ciente dos riscos
      </Modal>
    </Container>
  );
};

export default withRouter(Login);
