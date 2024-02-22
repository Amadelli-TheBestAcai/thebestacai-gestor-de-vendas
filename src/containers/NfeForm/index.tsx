import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Divider, notification } from "antd";
import { cleanObject } from "../../helpers/cleanObject";

import {
  Container,
  Footer,
  ButtonSave,
  ButtonCancel,
  Form,
  Row,
  Col,
  Input,
  FormItem,
} from "./styles";

import { Nfe } from "../../models/dtos/nfe";
import { ProductNfe } from "../../models/dtos/productNfe";
import { PaymentNfe } from "../../models/dtos/paymentNfe";
import { SaleFromApi } from "../../models/dtos/salesFromApi";

import { useStore } from "../../hooks/useStore";

type IProps = {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  setShouldSearch?: Dispatch<SetStateAction<boolean>>;
  sale: SaleFromApi;
};
const NfeForm: React.FC<IProps> = ({
  modalState,
  setModalState,
  sale,
  setShouldSearch,
}) => {
  const [isValid] = useState(true);
  const [emitingNfe, setEmitingNfe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nfe, setNfe] = useState<Nfe | null>(null);
  const [productsNfe, setProductsNfe] = useState<ProductNfe[]>([]);
  const [paymentsNfe, setPaymentsNfe] = useState<PaymentNfe[]>([]);
  const [form] = Form.useForm();
  const { store } = useStore();

  useEffect(() => {
    setIsLoading(true);
    if (modalState) {
      const products = sale.items.map((product) => ({
        id: product.product_id,
        name: product.product.name,
        product_store_id: product.product_store_id,
        price_sell: +product.price_unit * product.quantity,
        quantity: product.quantity || 1,
      }));

      const payments = sale.payments.map((payment) => ({
        amount: payment.amount,
        type: payment.type,
        flag_card:
          payment.type === 1 || payment.type === 2 ? payment.flag_card : null,
      }));

      setProductsNfe(products);
      setPaymentsNfe(payments);

      form.setFieldsValue({
        total_sold: sale.total_sold.toFixed(2).replace(".", ","),
        discount: (+sale.discount).toFixed(2).replace(".", ","),
      });

      setNfe((oldValues) => ({
        ...oldValues,
        discount: +sale.discount,
        change_amount: +sale.change_amount,
        total: sale.total_sold,
        store_id: store.company_id,
      }));
      setIsLoading(false);
    }
  }, [sale, modalState]);

  const handleUpdateNfe = (name, value) => {
    setNfe((oldValues) => ({ ...oldValues, [name]: value }));
  };

  const formasPagamento = [
    { id: 0, value: "Dinheiro" },
    { id: 1, value: "Cartão de Crédito" },
    { id: 2, value: "Cartão de Débito" },
    { id: 3, value: "Ticket" },
    { id: 5, value: "Boleto" },
    { id: 6, value: "Pix" },
    { id: 7, value: "Transferencia" },
  ];

  const handleEmit = async () => {
    let payload = form.getFieldsValue();
    if (!productsNfe.length) {
      return notification.warning({
        message: "Oops! O carrinho está vazio.",
        description: `Selecione algum item para continuar com a emissão da nota.`,
        duration: 5,
      });
    }

    const nfcePayload = {
      ...cleanObject(nfe),
      items: productsNfe.map((productNfe) => ({
        product_store_id: productNfe.product_store_id,
        price_sell: productNfe.price_sell,
        quantity: productNfe.quantity,
      })),
      payments: paymentsNfe.map((paymentNfe) => ({
        amount: paymentNfe.amount,
        type: paymentNfe.type,
        flag_card:
          paymentNfe.type === 1 || paymentNfe.type === 2
            ? paymentNfe.flag_card
            : null,
      })),
      ref: sale.ref
    };

    try {
      setEmitingNfe(true);
      setIsLoading(true);

      const {
        response,
        has_internal_error: errorOnEmitNfce,
        error_message,
      } = await window.Main.sale.emitNfce(nfcePayload, sale.id);

      const messageError = JSON.parse(error_message).erros.map(
        (error) => error.mensagem
      );

      if (errorOnEmitNfce) {
        return notification.error({
          message:
            messageError.map((message) => message + ".") ||
            "Erro ao emitir NFCe",
          duration: 5,
        });
      }
      const successOnSefaz = response?.status_sefaz === "100";
      notification[successOnSefaz ? "success" : "warning"]({
        message: response?.mensagem_sefaz,
        duration: 5,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setEmitingNfe(false);
      setModalState(false);
      setIsLoading(false);
      setShouldSearch(true);
    }
  };

  return (
    <Container
      title="Nfe"
      visible={modalState}
      destroyOnClose={true}
      closable={false}
      width={650}
      confirmLoading={emitingNfe}
      okButtonProps={{ disabled: !isValid }}
      centered
      footer={
        <Footer>
          <ButtonCancel onClick={() => setModalState(false)}>
            Cancelar
          </ButtonCancel>
          <ButtonSave onClick={() => handleEmit()} loading={isLoading}>
            Emitir
          </ButtonSave>
        </Footer>
      }
    >
      <Form layout="vertical" form={form}>
        <Divider orientation="left" plain>
          Informação
        </Divider>
        <Row>
          <Col span={12}>
            <FormItem label="CPF / CNPJ" name="cpf">
              <Input
                placeholder="CPF/CNPJ"
                className="ant-input"
                onChange={({ target: { value } }) =>
                  handleUpdateNfe("cpf", value)
                }
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Email" name="email">
              <Input
                placeholder="Email"
                className="ant-input"
                onChange={({ target: { value } }) =>
                  handleUpdateNfe("email", value)
                }
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="Total da Venda"
              name="total_sold"
              rules={[{ required: true }]}
            >
              <Input disabled />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="Desconto"
              name="discount"
              rules={[{ required: true }]}
            >
              <Input disabled />
            </FormItem>
          </Col>
        </Row>
        <Divider orientation="left" plain>
          Produtos
        </Divider>
        {productsNfe?.map((productNfe) => (
          <Row key={productNfe.id}>
            <Col span={12}>
              <FormItem label="Produto">
                <Input disabled defaultValue={productNfe.name} />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="Valor">
                <Input
                  disabled
                  defaultValue={productNfe.price_sell
                    ?.toFixed(2)
                    .replace(".", ",")}
                />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="Qtd.">
                <Input
                  disabled
                  defaultValue={productNfe.quantity
                    ?.toFixed(3)
                    .replace(".", ",")}
                />
              </FormItem>
            </Col>
          </Row>
        ))}
        <Divider orientation="left" plain>
          Pagamentos
        </Divider>
        {paymentsNfe?.map((paymentNfe) => (
          <Row>
            <Col span={12}>
              <FormItem label="Valor do pagamento">
                <Input
                  disabled
                  defaultValue={paymentNfe.amount?.toFixed(2).replace(".", ",")}
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Forma de Pagamento">
                <Input
                  disabled
                  defaultValue={
                    formasPagamento.find((type) => type.id === paymentNfe.type)
                      .value
                  }
                />
              </FormItem>
            </Col>
          </Row>
        ))}
      </Form>
    </Container>
  );
};

export default NfeForm;
