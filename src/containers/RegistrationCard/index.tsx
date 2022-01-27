import React, { useState, Dispatch, SetStateAction, useEffect } from "react";

import { message } from "antd";
import { SaleDto } from "../../models/dtos/sale";
import Spinner from "../../components/Spinner";
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
import { useSale } from "../../hooks/useSale";
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
      const _stepSales = await window.Main.sale.getAllStepSales();
      setStepSales(_stepSales);
      setName("");
      setLoading(false);
    }
    if (modalState) {
      init();
    }
  }, [modalState]);

  const handleSubmit = async () => {
    if (!name) {
      return message.warning("Preencha o campo");
    }

    if (!sale.quantity) {
      return message.warning("A venda atual não possui nenhum produto");
    }
    setLoading(true);
    await onAddToQueue(name);
    setLoading(false);
    setModalState(false);
  };

  const handleRestore = async (id: string) => {
    setLoading(true);
    const _updatedSale = await window.Main.sale.recouverStepSales(id);
    setSale(_updatedSale);
    setLoading(false);
    setModalState(false);
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
