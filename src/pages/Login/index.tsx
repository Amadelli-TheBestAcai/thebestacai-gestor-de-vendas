import React, { useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";

import LogoImg from "../../assets/img/logo-login.png";
import { StoreDto } from "../../models/dtos/store";

import { message, Form, Select } from "antd";

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
} from "./styles";

const Option = Select;

type IProps = RouteComponentProps;

const Login: React.FC<IProps> = ({ history }) => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<number>(1);
  const [store, setStore] = useState<number | undefined>(undefined);
  const [stores, setStores] = useState<StoreDto[]>([]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [typeInput, setTypeInput] = useState<string>("password");
  const [rememberUser, setRememberUser] = useState<boolean>(false);

  const handleState = ({ target: { name, value } }: any) =>
    setUser((oldValues) => ({ ...oldValues, [name]: value }));

  const persistUser = async () => {
    setRememberUser(!rememberUser);

    const _user = await window.Main.user.getUser();
  };

  const onLogin = async () => {
    setLoading(true);
    const loggedUser = await window.Main.user.login(
      user.username,
      user.password
    );
    if (loggedUser) {
      const registredStore = await window.Main.store.hasRegistration();
      if (registredStore) {
        setLoading(false);
        return history.push("/home");
      } else {
        const stores = await window.Main.store.getFromApi();
        setStores(stores);
        setLoading(false);
        setStep(2);
      }
    } else {
      message.error("Credenciais inválidas");
    }
  };

  const registerStore = async () => {
    if (!store) {
      message.warning("Selecione uma loja");
      return;
    }
    const storeToRegister = stores.find(
      (_store) => _store.company.id === store
    );
    await window.Main.store.create(storeToRegister);
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

  return (
    <Container>
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
              onFinish={step === 1 ? onLogin : registerStore}
              layout="vertical"
            >
              {step === 1 ? (
                <>
                  <Form.Item
                    label="Usuário"
                    name="username"
                    rules={[{ required: true, message: "Campo obrigatório" }]}
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
                    rules={[{ required: true, message: "Campo obrigatório" }]}
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
                    rules={[{ required: true, message: "Selecione a Loja" }]}
                  >
                    <Select
                      onChange={(value) => setStore(+value)}
                      placeholder="Selecione uma loja"
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
                    <button onClick={() => persistUser()}>
                      <input type="checkbox" checked={rememberUser} />
                      Lembra usuário
                    </button>

                    <button onClick={() => viewPassword()}>Mostra senha</button>
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
                Está com problemas para acessar? Entre em contato <br /> conosco
                <span> comunicathebestacai@gmail.com</span>.
              </p>
            </ContactInfo>
          </FormContent>
        </FormContainer>

        <Footer>
          <span>Developed by The Best Açai Company v 4.0.0</span>
        </Footer>
      </RightContent>
    </Container>
  );
};

export default withRouter(Login);
