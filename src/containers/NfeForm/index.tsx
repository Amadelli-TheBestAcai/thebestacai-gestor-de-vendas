import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import axios from "axios";
import { v4 } from "uuid";
import { onlyNumbers } from "../../helpers/onlyNumber";
import { cleanObject } from "../../helpers/cleanObject";
// import { ipcRenderer } from "electron";

import { Divider, message as messageAnt } from "antd";

import { Nfe } from "../../models/dtos/nfe";

import {
  Container,
  Form,
  Row,
  Col,
  Input,
  FormItem,
  Select,
  Option,
  InputMask,
} from "./styles";

import { ProductNfe } from "../../models/dtos/productNfe";
import { SaleDto } from "../../models/dtos/sale";

type IProps = {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  setShouldSearch?: Dispatch<SetStateAction<boolean>>;
  sale: SaleDto;
};
const NfeForm: React.FC<IProps> = ({
  modalState,
  setModalState,
  sale,
  setShouldSearch,
}) => {
  const [isValid, setIsValid] = useState(true);
  const [emitingNfe, setEmitingNfe] = useState(false);
  const [nfe, setNfe] = useState<Nfe | null>(null);
  const [productsNfe, setProductsNfe] = useState<ProductNfe[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (modalState) {
      const products = sale.items.map((product) => ({
        id: v4(),
        idItem: product.storeProduct.product_id,
        codigo: +product.storeProduct.product_id,
        descricao: product.product.name,
        ncm: product.product.cod_ncm?.toString(),
        cfop: product.storeProduct.cfop,
        unidadeComercial: product.storeProduct.unity_taxable?.toString(),
        quantidadeComercial: +product.quantity,
        valorUnitarioComercial: +product.storeProduct.price_unit,
        unidadeTributaria: product.storeProduct.unity_taxable?.toString(),
        quantidadeTributavel: +product.quantity,
        valorUnitarioTributario: +product.storeProduct.price_unit,
        origem: +product.storeProduct.icms_origin,
        informacoesAdicionais: product.storeProduct.additional_information,
        PISCOFINSST: false,
        csosn: 102,
        cEAN: "SEM GTIN",
        cEANTrib: "SEM GTIN",
      }));

      products.forEach((product) => {
        const errors: string[] = [];
        if (!product.ncm) {
          errors.push("NCM");
        }
        if (!product.cfop) {
          errors.push("CFOP");
        }
        if (!product.unidadeComercial) {
          errors.push("Unidade Tributável");
        }
        if (!product.valorUnitarioComercial) {
          errors.push("Valor de Venda");
        }
        if (!product.origem && product.origem !== 0) {
          errors.push("Origem");
        }
        if (!product.csosn) {
          errors.push("Situação Tributária");
        }

        if (errors.length) {
          setIsValid(false);
          messageAnt.warning(
            `O produto ${product.descricao} não possui os dados ${errors.join(
              ", "
            )}`
          );
        }
      });

      const getTotalSold = (sale: SaleDto) => {
        return (
          (sale.payments?.reduce(
            (total, payment) => total + +payment.amount,
            0
          ) || 0) -
          (+sale.discount || 0) -
          (+sale.change_amount || 0)
        )
          .toFixed(2)
          .replace(".", ",");
      };

      setProductsNfe(products);
      form.setFieldsValue({
        valorPagamento: getTotalSold(sale),
        troco: (+sale.change_amount).toFixed(2).replace(".", ","),
      });
      setNfe((oldValues) => ({
        ...oldValues,
        troco: +sale.change_amount,
        valorPagamento: +sale.total_sold,
      }));
    }
  }, [sale, modalState]);

  const handleCep = async (cep: string) => {
    if (cep.length === 8) {
      const {
        data: { logradouro, bairro, localidade, uf },
      } = await axios({
        method: "GET",
        url: `https://viacep.com.br/ws/${cep}/json/`,
      });
      setNfe((oldValues) => ({
        ...oldValues,
        municipioDestinatario: localidade,
        logradouroDestinatario: logradouro,
        bairroDestinatario: bairro,
        UFDestinatario: uf,
      }));
      form.setFieldsValue({
        municipioDestinatario: localidade,
        logradouroDestinatario: logradouro,
        bairroDestinatario: bairro,
        UFDestinatario: uf,
      });
    }
  };

  const handleUpdateNfe = (name, value) => {
    setNfe((oldValues) => ({ ...oldValues, [name]: value }));
  };

  const formasPagamento = [
    { id: "01", value: "Dinheiro" },
    { id: "02", value: "Cheque" },
    { id: "03", value: "Cartão de Crédito" },
    { id: "04", value: "Cartão de Débito" },
    { id: "05", value: "Crédito Loja" },
    { id: "10", value: "Vale Alimentação" },
    { id: "11", value: "Vale Refeição" },
    { id: "12", value: "Vale Presente" },
    { id: "13", value: "Vale Combustível" },
    { id: "15", value: "Boleto Bancário" },
    { id: "99", value: "Outros" },
  ];

  const indicadoresFormaPagamento = [
    { id: 0, value: "À vista" },
    { id: 1, value: "À prazo" },
    { id: 2, value: "Outros" },
  ];

  const handleEmit = () => {
    if (!productsNfe.length) {
      messageAnt.warning("Adicione pelo menos um produto");
      return;
    }
    const nfcePayload = {
      ...cleanObject(nfe),
      informacoesAdicionaisFisco:
        nfe.informacoesAdicionaisFisco || "Sem informacoes adicionais",
      produtos: productsNfe.map(({ id, ...props }, index) => ({
        ...props,
        idItem: index + 1,
        quantidadeTributavel: props.quantidadeComercial,
      })),
    };
    setEmitingNfe(true);
    // ipcRenderer.send("sale:nfe", { nfce: nfcePayload, sale_id: sale.id });
    // ipcRenderer.once("sale:nfe:response", (event, { error, message }) => {
    //   setEmitingNfe(false);
    //   if (error) {
    //     messageAnt.error(message || "Falha ao emitir NFCe, contate o suporte.");
    //   } else {
    //     setModalState(false);
    //     setShouldSearch(true);
    //     messageAnt.success(message || "NFCe emitida com sucesso");
    //   }
    // });
  };

  return (
    <Container
      title="Nfe"
      visible={modalState}
      onOk={handleEmit}
      closable={false}
      onCancel={() => setModalState(false)}
      width={650}
      confirmLoading={emitingNfe}
      okButtonProps={{ disabled: !isValid }}
      destroyOnClose={true}
    >
      <Form layout="vertical" form={form}>
        <Divider orientation="left" plain>
          Pagamento
        </Divider>
        <Row>
          <Col span={5}>
            <FormItem
              label="Tipo"
              name="indicadorFormaPagamento"
              rules={[{ required: true }]}
            >
              <Select
                onChange={(value) =>
                  handleUpdateNfe("indicadorFormaPagamento", +value)
                }
              >
                {indicadoresFormaPagamento.map((indicadorFormaPagamento) => (
                  <Option key={indicadorFormaPagamento.id}>
                    {indicadorFormaPagamento.value}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col span={9}>
            <FormItem
              label="Forma"
              name="formaPagamento"
              rules={[{ required: true }]}
            >
              <Select
                onChange={(value) => handleUpdateNfe("formaPagamento", value)}
              >
                {formasPagamento.map((formaPagamento) => (
                  <Option key={formaPagamento.id}>
                    {formaPagamento.value}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem label="Valor" name="valorPagamento">
              <Input disabled />
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem label="Troco" name="troco">
              <Input disabled />
            </FormItem>
          </Col>
        </Row>
        <Divider orientation="left" plain>
          Destinatário
        </Divider>
        <Row>
          <Col span={24}>
            <FormItem label="Nome" name="nomeDestinatario">
              <Input
                onChange={({ target: { value } }) =>
                  handleUpdateNfe("nomeDestinatario", value)
                }
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="CPF" name="CPFDestinatario">
              <InputMask
                mask="999.999.999-99"
                className="ant-input"
                onChange={({ target: { value } }) =>
                  handleUpdateNfe("CPFDestinatario", value)
                }
              />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="CEP">
              <InputMask
                mask="99999-999"
                className="ant-input"
                onChange={({ target: { value } }) =>
                  handleCep(onlyNumbers(value)?.toString())
                }
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="Municipio" name="municipioDestinatario">
              <Input disabled />
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Logradouro" name="logradouroDestinatario">
              <Input disabled />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label="Bairro" name="bairroDestinatario">
              <Input disabled />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="Número" name="numeroDestinatario">
              <Input
                onChange={({ target: { value } }) =>
                  handleUpdateNfe("numeroDestinatario", value)
                }
              />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="UF" name="UFDestinatario">
              <Input disabled />
            </FormItem>
          </Col>
        </Row>
        <Divider orientation="left" plain>
          Adicionais
        </Divider>
        <Row>
          <Col span={24}>
            <FormItem
              label="Informações Adicionais"
              name="informacoesAdicionaisFisco"
            >
              <Input
                onChange={({ target: { value } }) =>
                  handleUpdateNfe("informacoesAdicionaisFisco", value)
                }
              />
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
                <Input disabled defaultValue={productNfe.descricao} />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="Valor">
                <Input
                  disabled
                  defaultValue={productNfe.valorUnitarioComercial
                    ?.toFixed(2)
                    .replace(".", ",")}
                />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="Qtd.">
                <Input
                  disabled
                  defaultValue={productNfe.quantidadeComercial
                    ?.toFixed(2)
                    .replace(".", ",")}
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
