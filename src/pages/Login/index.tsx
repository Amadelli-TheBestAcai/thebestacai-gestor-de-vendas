import React, { useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { StoreDto } from "../../models/dtos/store";
import { message, Form } from "antd";
import {
  Container,
  FormContainer,
  Logo,
  Description,
  Button,
  Input,
  Password,
  FormItem,
  ButtonSecondary,
  Select,
  Option,
} from "./styles";
import ImageLogo from "../../assets/img/logo-login.png";

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

  const handleState = ({ target: { name, value } }: any) =>
    setUser((oldValues) => ({ ...oldValues, [name]: value }));

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

  return (
    <Container>
      {step === 1 && (
        <FormContainer>
          <Logo src={ImageLogo} />
          <Description>
            <h1>Gestor de Vendas</h1>
            <h3>Insira seu usuário e senha para se conectar</h3>
          </Description>
          <Form onFinish={onLogin} layout="vertical">
            <FormItem
              label="Usuário"
              style={{ fontSize: "14px" }}
              name="username"
              rules={[{ required: true, message: "Digite o usuário!" }]}
            >
              <Input
                name="username"
                placeholder="Digite seu usuário"
                onChange={(event) => handleState(event)}
              />
            </FormItem>
            <FormItem
              label="Senha"
              style={{ fontSize: "14px" }}
              name="password"
              rules={[{ required: true, message: "Digite a senha!" }]}
            >
              <Password
                name="password"
                placeholder="Digite sua senha"
                onChange={(event) => handleState(event)}
              />
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ width: "100%", height: "37px" }}
              >
                ENTRAR
              </Button>
            </FormItem>
            <FormItem>
              <ButtonSecondary
                type="default"
                style={{ width: "100%", height: "37px" }}
                onClick={() => console.log(stores)}
              >
                ESTOU COM PROBLEMAS!
              </ButtonSecondary>
            </FormItem>
          </Form>
        </FormContainer>
      )}
      {step === 2 && (
        <FormContainer>
          <Logo src={ImageLogo} />
          <Description>
            <h1>Defina sua Loja</h1>
          </Description>
          <Form onFinish={registerStore} layout="vertical">
            <FormItem
              label="Loja"
              style={{ fontSize: "14px" }}
              name="username"
              rules={[{ required: true, message: "Selecione a Loja" }]}
            >
              <Select
                onChange={(value) => setStore(+value)}
                placeholder="Selecione uma loja"
                style={{ textTransform: "uppercase" }}
              >
                {stores.map((store) => (
                  <Option
                    style={{ textTransform: "uppercase" }}
                    key={store.company_id}
                  >
                    {store.company.company_name}
                  </Option>
                ))}
              </Select>
            </FormItem>

            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ width: "100%", height: "37px" }}
              >
                ENTRAR
              </Button>
            </FormItem>
            <FormItem>
              <ButtonSecondary
                type="default"
                onClick={() => setStep(1)}
                style={{ width: "100%", height: "37px" }}
              >
                VOLTAR
              </ButtonSecondary>
            </FormItem>
          </Form>
        </FormContainer>
      )}
    </Container>
  );
};

export default withRouter(Login);
