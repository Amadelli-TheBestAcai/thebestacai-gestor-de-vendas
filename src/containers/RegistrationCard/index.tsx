import React, { useState, Dispatch, SetStateAction } from "react";

import { message } from "antd";

import {
  Container,
  AddContainer,
  ListContainer,
  Input,
  ButtonAdd,
  Header,
  Col,
  Content,
  Card,
  RestoreIcon,
} from "./styles";

interface IProps {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  placeHolder: string;
  onFinish: (name: string) => void;
}

const RegistrationCard: React.FC<IProps> = ({
  onFinish,
  placeHolder,
  modalState,
  setModalState,
}) => {
  const [name, setName] = useState<string>();
  const handleSubmit = () => {
    if (!name) {
      return message.warning("Preencha o campo");
    }
    setModalState(false);
    onFinish(name);
  };
  return (
    <Container
      title="Comandas"
      visible={modalState}
      onOk={handleSubmit}
      centered
      closable={true}
      onCancel={() => setModalState(false)}
      width={800}
      destroyOnClose={true}
      footer={null}
    >
      <AddContainer>
        <Input
          placeholder="Digite o nome do cliente"
          autoFocus={true}
          onPressEnter={handleSubmit}
          onChange={({ target: { value } }) => setName(value)}
          value={name}
        />
        <ButtonAdd>Adicionar</ButtonAdd>
      </AddContainer>
      <ListContainer>
        <Header>
          <Col sm={8}>Nome Cliente</Col>
          <Col sm={6}>Nº Comanda</Col>
          <Col sm={6}>Qtd. itens</Col>
          <Col sm={4}>Ação</Col>
        </Header>

        <Content>
          <Card>
            <Col sm={8}>Mayshara</Col>
            <Col sm={6}>1</Col>
            <Col sm={6}>3</Col>
            <Col sm={4}>
              <RestoreIcon />
            </Col>
          </Card>
        </Content>
      </ListContainer>
    </Container>
  );
};

export default RegistrationCard;
