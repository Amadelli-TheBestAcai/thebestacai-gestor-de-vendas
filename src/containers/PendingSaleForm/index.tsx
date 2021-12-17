import React, { useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { message } from "antd";
import MonetaryInput from "../../components/MonetaryInput";

import {
  Container,
  Form,
  FormItem,
  SelectOption,
  Button,
  Select,
  ActionContainer,
} from "./styles";

interface IProps extends RouteComponentProps {
  modalState: boolean;
  cashes: { available: boolean; store_cash: string }[];
}

const PendingSaleForm: React.FC<IProps> = ({ modalState, cashes, history }) => {
  const [visible, setVisible] = useState(modalState);
  const [cash, setCash] = useState<string>();
  const [amount, setAmount] = useState<number>();
  const [isIntegrating, setIntegrating] = useState(false);

  const onFinish = () => {
    setIntegrating(true);

    /*
    ipcRenderer.send('integrate:offline', {
      code: cash,
      amount_on_close: amount,
    })
    ipcRenderer.on('integrate:offline:response', (event, success) => {
      setIntegrating(false)
      if (success) {
        window.location.reload()
        return message.success('Vendas integradas com sucesso')
      } else {
        return message.warning('Erro ao integrar vendas. Contate o suporte')
      }
    })
    */
  };

  const handleSelect = (value) => {
    setCash(value);
  };
  return (
    <Container
      visible={visible}
      title="Integração de vendas offline"
      footer={null}
      closable={false}
      width={320}
    >
      <Form onFinish={() => onFinish()} layout="vertical">
        <FormItem
          label="Caixa"
          name="store_cash"
          rules={[{ required: true, message: "Selecione um caixa" }]}
        >
          <Select onChange={handleSelect}>
            {cashes.map(
              (cash) =>
                cash.available && (
                  <SelectOption key={cash.store_cash}>
                    {cash.store_cash}
                  </SelectOption>
                )
            )}
          </Select>
        </FormItem>
        <FormItem label="Valor de Fechamento" name="amount_on_close">
          <MonetaryInput
            autoFocus={true}
            getValue={(value) => setAmount(value)}
          />
        </FormItem>
        <FormItem>
          <ActionContainer>
            <Button
              style={{ marginRight: "10px" }}
              onClick={() => history.push("/home")}
            >
              Voltar
            </Button>
            <Button htmlType="submit" loading={isIntegrating} type="primary">
              Enviar
            </Button>
          </ActionContainer>
        </FormItem>
      </Form>
    </Container>
  );
};

export default withRouter(PendingSaleForm);
