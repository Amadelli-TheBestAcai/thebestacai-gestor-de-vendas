import React, { useState, Dispatch, SetStateAction, useEffect } from "react";
import { useSale } from "../../hooks/useSale";
import { SaleDto } from "../../models/dtos/sale";

import Spinner from "../../components/Spinner";

import { message, notification } from "antd";

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
}

const RegistrationCard: React.FC<IProps> = ({ modalState, setModalState }) => {
  const { onAddToQueue, setSale, sale } = useSale();
  const [stepSales, setStepSales] = useState<SaleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<string>();

  useEffect(() => {
    async function init() {
      const { response: _stepSales, has_internal_error: errorOnStepSales } =
        await window.Main.sale.getAllStepSales();
      if (errorOnStepSales) {
        return notification.error({
          message: "Erro ao obter comanda",
          duration: 5,
        });
      }
      setStepSales(_stepSales);
      setName("");
      setLoading(false);
    }
    if (modalState) {
      init();
    }
  }, [modalState]);

  const handleSubmit = async () => {
    if (name.length < 3) {
      return notification.warning({
        message: "Oops! Nome inválido",
        description: `Informe um nome válido para salvar a comanda.`,
        duration: 5,
      });
    }

    if (!sale.quantity) {
      return notification.warning({
        message: "O carrinho está vazio",
        description: `Não é possível salvar esta comanda, pois, não existe nenhum item selecionado para venda.`,
        duration: 5,
      });
    }
    setLoading(true);
    await onAddToQueue(name);
    setLoading(false);
    setModalState(false);
  };

  const handleRestore = async (id: string) => {
    setLoading(true);
    const {
      response: _updatedSale,
      has_internal_error: errorOnRecouverStepSales,
    } = await window.Main.sale.recouverStepSales(id);
    if (errorOnRecouverStepSales) {
      return notification.error({
        message: "Erro ao restaurar a comanda",
        duration: 5,
      });
    }
    setSale(_updatedSale);
    setLoading(false);
    setModalState(false);
    return notification.success({
      message: "Comanda restaurada com sucesso!",
      description:
        "Todos os itens retornaram para o carrinho. Conclua a venda!",
      duration: 5,
    });
  };

  return (
    <Container
      title="Comandas"
      visible={modalState}
      centered
      closable={true}
      onCancel={() => setModalState(false)}
      width={800}
      destroyOnClose={true}
      footer={null}
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          <AddContainer>
            <Input
              placeholder="Digite o nome do cliente"
              autoFocus={true}
              onPressEnter={handleSubmit}
              onChange={({ target: { value } }) => setName(value)}
              value={name}
            />
            <ButtonAdd onClick={handleSubmit}>Adicionar</ButtonAdd>
          </AddContainer>
          <ListContainer>
            <Header>
              <Col sm={8}>Nome Cliente</Col>
              <Col sm={6}>Nº Comanda</Col>
              <Col sm={6}>Qtd. itens</Col>
              <Col sm={4}>Ação</Col>
            </Header>

            <Content>
              {stepSales.map((_stepSale, index) => (
                <React.Fragment key={_stepSale.id}>
                  <Card>
                    <Col sm={8}>{_stepSale.name}</Col>
                    <Col sm={6}>{index + 1}</Col>
                    <Col sm={6}>{_stepSale.quantity}</Col>
                    <Col sm={4}>
                      <RestoreIcon
                        onClick={() => handleRestore(_stepSale.id)}
                      />
                    </Col>
                  </Card>
                </React.Fragment>
              ))}
            </Content>
          </ListContainer>
        </>
      )}
    </Container>
  );
};

export default RegistrationCard;
