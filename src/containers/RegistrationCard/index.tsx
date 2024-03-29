import React, { useState, Dispatch, SetStateAction, useEffect } from "react";
import { useSale } from "../../hooks/useSale";
import { SaleDto } from "../../models/dtos/sale";
import moment from "moment";
import Spinner from "../../components/Spinner";

import { notification, Tooltip, Modal } from "antd";

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
  RemoveIcon,
  SwitchIcon,
  Form,
  Textarea,
} from "./styles";
import { ItemDto } from "../../models/dtos/item";
import { useUser } from "../../hooks/useUser";
interface IProps {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
}

const RegistrationCard: React.FC<IProps> = ({ modalState, setModalState }) => {
  const { onAddToQueue, setSale, sale, setOpenedStepSale } = useSale();
  const [stepSales, setStepSales] = useState<SaleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<string>();
  const [formDeleteCommand] = Form.useForm();
  const [deleteCommand, setDeleteCommand] = useState("");
  const { hasPermission } = useUser();

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
      const stepSalesOrdened = _stepSales.sort((a, b) => {
        if (a.created_at > b.created_at) {
          return 1;
        }
        if (a.created_at < b.created_at) {
          return -1;
        }
        return 0;
      });
      setStepSales(stepSalesOrdened);
      setName("");
      setLoading(false);
    }
    if (modalState || loading) {
      init();
    }
  }, [modalState, loading]);

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
    await updateOpenedStepSale();
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
    await updateOpenedStepSale();
    setLoading(false);
    setModalState(false);
    document.getElementById("balanceInput").focus();
    return notification.success({
      message: "Comanda restaurada com sucesso!",
      description:
        "Todos os itens retornaram para o carrinho. Conclua a venda!",
      duration: 5,
    });
  };

  const handleDelete = async (id: string, items: ItemDto[]) => {
    const command = stepSales;
    const renderTextArea = command && (
      <Form form={formDeleteCommand}>
        <Form.Item
          label=""
          name="textArea"
          rules={[
            { required: true, message: "Campo obrigatório" },
            {
              min: 10,
              message: "A justificativa deve ter no minimo 10 caracteres",
            },
            {
              max: 255,
              message: "A justificativa deve ter no máximo 255 caracteres",
            },
          ]}
        >
          <Textarea
            id="deleteCommand"
            placeholder="Justificativa - 10 a 255 caracteres"
            minLength={10}
            maxLength={255}
            style={{ width: "100%" }}
            onChange={({ target: { value } }) => setDeleteCommand(value || "")}
          />
        </Form.Item>
      </Form>
    );
    Modal.confirm({
      title: "Tem certeza que gostaria de prosseguir?",
      content: renderTextArea,
      okText: "Sim",
      okType: "default",
      cancelText: "Não",
      centered: true,
      okButtonProps: {
        loading: loading,
      },
      async onOk() {
        await formDeleteCommand.validateFields();
        setLoading(true);
        const {
          response: _stepSales,
          has_internal_error: errorOnStepSales,
          error_message,
        } = await window.Main.sale.removeStepSale(id);
        if (errorOnStepSales) {
          return notification.error({
            message: error_message || "Erro ao obter comanda",
            duration: 5,
          });
        }
        await updateOpenedStepSale();

        for (const item of items) {
          try {
            const {
              has_internal_error: errorItemsOutCart,
              error_message: errorMessage,
            } = await window.Main.itemOutCart.create(
              `Comanda: ${formDeleteCommand.getFieldValue("textArea")}`,
              item.product.id,
              item.total
            );
            if (errorItemsOutCart) {
              notification.error({
                message: errorMessage || "Erro ao cadastrar um item excluído",
                duration: 5,
              });
            }
          } catch (error) {
            console.error("Erro durante a execução:", error);
          }
        }
        formDeleteCommand.resetFields();
        setLoading(false);
      },
      onCancel() {
        formDeleteCommand.resetFields();
      },
    });
  };

  const handleEnable = async (sale: SaleDto) => {
    Modal.confirm({
      title: `${
        sale.enabled
          ? "Deseja habilitar comanda de funcionário?"
          : "Deseja desabilitar comanda de funcionário?"
      }`,
      content: `${
        sale.enabled
          ? "Essa comanda não será considerada no fechamento de caixa."
          : "Essa comanda será considerada no fechamento de caixa."
      }`,
      okText: "Sim",
      okType: "default",
      cancelText: "Não",
      centered: true,
      okButtonProps: {
        loading: loading,
      },
      async onOk() {
        setLoading(true);
        const {
          response: _stepSales,
          has_internal_error: errorOnStepSales,
          error_message,
        } = await window.Main.sale.updateStepSale(sale.id, {
          ...sale,
          enabled: sale.enabled ? false : true,
        });
        if (errorOnStepSales) {
          return notification.error({
            message: error_message || "Erro ao obter comanda",
            duration: 5,
          });
        }
        await updateOpenedStepSale();
        setLoading(false);
      },
    });
  };

  const updateOpenedStepSale = async () => {
    const { response: _stepSales } = await window.Main.sale.getAllStepSales();
    setOpenedStepSale(_stepSales.filter((sale) => sale.enabled).length);
  };

  return (
    <Container
      title="Comandas"
      visible={modalState}
      centered
      closable={true}
      onCancel={() => setModalState(false)}
      width={800}
      afterClose={() => document.getElementById("balanceInput").focus()}
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
              <Col sm={5}>Nome Cliente</Col>
              <Col sm={4}>Data</Col>
              <Col sm={2}>Nº Comanda</Col>
              <Col sm={3}>Valor</Col>
              <Col sm={2}>Qtd. itens</Col>
              <Col sm={4}>Funcionário</Col>
              <Col sm={3}>Ação</Col>
            </Header>

            <Content>
              {stepSales.map((_stepSale, index) => (
                <React.Fragment key={_stepSale.id}>
                  <Card>
                    <Col sm={5}>{_stepSale.name}</Col>
                    <Col sm={4}>
                      {moment(_stepSale.created_at).format(
                        "DD/MM/YYYY HH:mm:ss"
                      )}
                    </Col>
                    <Col sm={2}>{index + 1}</Col>
                    <Col sm={3}>R$ {_stepSale.total_sold.toFixed(2)}</Col>
                    <Col sm={2}>{_stepSale.quantity}</Col>
                    <Col sm={4}>
                      {" "}
                      <Tooltip
                        title={
                          _stepSale.enabled
                            ? "Comanda Cliente"
                            : "Comanda Funcionário"
                        }
                        placement="bottom"
                      >
                        <SwitchIcon
                          disabled={
                            !_stepSale.enabled
                              ? !hasPermission("command.enabled")
                              : false
                          }
                          checked={!_stepSale.enabled}
                          onChange={async () => await handleEnable(_stepSale)}
                        />
                      </Tooltip>
                    </Col>
                    <Col sm={3} style={{ justifyContent: "space-evenly" }}>
                      <Tooltip title={"Retornar a comanda"} placement="bottom">
                        <RestoreIcon
                          onClick={async () =>
                            await handleRestore(_stepSale.id)
                          }
                        />
                      </Tooltip>
                      {hasPermission("command.delete_command") && (
                        <Tooltip title={"Remover a comanda"} placement="bottom">
                          <RemoveIcon
                            onClick={async () =>
                              await handleDelete(
                                _stepSale.id.toString(),
                                _stepSale.items
                              )
                            }
                          />
                        </Tooltip>
                      )}
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
