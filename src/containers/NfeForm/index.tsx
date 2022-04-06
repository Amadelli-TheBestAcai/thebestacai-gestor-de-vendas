import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { v4 } from "uuid";
import { cleanObject } from "../../helpers/cleanObject";

import { Divider, message as messageAnt, notification } from "antd";

import { Nfe } from "../../models/dtos/nfe";

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
  Select,
  Option,
  TotalValue,
} from "./styles";

import { ProductNfe } from "../../models/dtos/productNfe";
import { SaleFromApi } from "../../models/dtos/salesFromApi";

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
  // const [isValid, setIsValid] = useState(true);
  // const [emitingNfe, setEmitingNfe] = useState(false);
  // const [nfe, setNfe] = useState<Nfe | null>(null);
  // const [productsNfe, setProductsNfe] = useState<ProductNfe[]>([]);
  // const [form] = Form.useForm();

  // useEffect(() => {
  //   if (modalState) {
  //     const products = sale.items.map((product) => ({
  //       id: v4(),
  //       idItem: product.storeProduct.product_id,
  //       codigo: +product.storeProduct.product_id,
  //       descricao: product.product.name,
  //       ncm: product.product.cod_ncm?.toString(),
  //       cfop: product.storeProduct.cfop,
  //       unidadeComercial: product.storeProduct.unity_taxable?.toString(),
  //       quantidadeComercial: +product.quantity,
  //       valorUnitarioComercial: +product.storeProduct.price_unit,
  //       unidadeTributaria: product.storeProduct.unity_taxable?.toString(),
  //       quantidadeTributavel: +product.quantity,
  //       valorUnitarioTributario: +product.storeProduct.price_unit,
  //       origem: +product.storeProduct.icms_origin,
  //       informacoesAdicionais: product.storeProduct.additional_information,
  //       PISCOFINSST: false,
  //       csosn: 102,
  //       cEAN: "SEM GTIN",
  //       cEANTrib: "SEM GTIN",
  //     }));

  //     products.forEach((product) => {
  //       const errors: string[] = [];
  //       if (!product.ncm) {
  //         errors.push("NCM");
  //       }
  //       if (!product.cfop) {
  //         errors.push("CFOP");
  //       }
  //       if (!product.unidadeComercial) {
  //         errors.push("Unidade Tributável");
  //       }
  //       if (!product.valorUnitarioComercial) {
  //         errors.push("Valor de Venda");
  //       }
  //       if (!product.origem && product.origem !== 0) {
  //         errors.push("Origem");
  //       }
  //       if (!product.csosn) {
  //         errors.push("Situação Tributária");
  //       }

  //       if (errors.length) {
  //         setIsValid(false);
  //         messageAnt.warning(
  //           `O produto ${product.descricao} não possui os dados ${errors.join(
  //             ", "
  //           )}`
  //         );
  //         setModalState(false);
  //       }
  //     });

  //     const getTotalSold = (sale: SaleFromApi) => {
  //       return (
  //         (sale.payments?.reduce(
  //           (total, payment) => total + +payment.amount,
  //           0
  //         ) || 0) - (+sale.change_amount || 0)
  //       )
  //         .toFixed(2)
  //         .replace(".", ",");
  //     };

  //     setProductsNfe(products);
  //     form.setFieldsValue({
  //       valorPagamento: getTotalSold(sale),
  //       troco: (+sale.change_amount).toFixed(2).replace(".", ","),
  //     });
  //     setNfe((oldValues) => ({
  //       ...oldValues,
  //       troco: +sale.change_amount,
  //       valorPagamento: +sale.total_sold,
  //     }));
  //   }
  // }, [sale, modalState]);

  // const handleUpdateNfe = (name, value) => {
  //   setNfe((oldValues) => ({ ...oldValues, [name]: value }));
  // };

  // const formasPagamento = [
  //   { id: "01", value: "Dinheiro" },
  //   { id: "02", value: "Cheque" },
  //   { id: "03", value: "Cartão de Crédito" },
  //   { id: "04", value: "Cartão de Débito" },
  //   { id: "05", value: "Crédito Loja" },
  //   { id: "10", value: "Vale Alimentação" },
  //   { id: "11", value: "Vale Refeição" },
  //   { id: "12", value: "Vale Presente" },
  //   { id: "13", value: "Vale Combustível" },
  //   { id: "15", value: "Boleto Bancário" },
  //   { id: "99", value: "Outros" },
  // ];

  // const indicadoresFormaPagamento = [
  //   { id: 0, value: "À vista" },
  //   { id: 1, value: "À prazo" },
  //   { id: 2, value: "Outros" },
  // ];

  // const handleEmit = async () => {
  //   let payload = form.getFieldsValue();
  //   if (!productsNfe.length) {
  //     return notification.warning({
  //       message: "Oops! O carrinho está vazio.",
  //       description: `Selecione algum item para continuar com a emissão da nota.`,
  //       duration: 5,
  //     });
  //   }

  //   if (!payload.formaPagamento || !payload.indicadorFormaPagamento) {
  //     return notification.warning({
  //       message: "Operação e Tipo são obrigatórios.",
  //       description: `Preencha os campos corretamente, para finalizar a emissão da nota.`,
  //       duration: 5,
  //     });
  //   }
  //   const nfcePayload = {
  //     ...cleanObject(nfe),
  //     informacoesAdicionaisFisco:
  //       nfe.informacoesAdicionaisFisco || "Sem informacoes adicionais",
  //     produtos: productsNfe.map(({ id, ...props }, index) => ({
  //       ...props,
  //       idItem: index + 1,
  //       quantidadeTributavel: props.quantidadeComercial,
  //     })),
  //   };
  //   console.log(JSON.stringify(nfcePayload));
  //   setEmitingNfe(true);
  //   const nfce = await window.Main.sale.emitNfce(nfcePayload, sale.id);
  //   setEmitingNfe(false);
  //   if (nfce.response.error === true) {
  //     return notification.error({
  //       message: "Oops! Não foi possível emitir a NFCe.",
  //       description: `Tente novamente, caso o problema persista, contate o suporte através do chat.`,
  //       duration: 5,
  //     });
  //   } else {
  //     setModalState(false);
  //     setShouldSearch(true);
  //     notification.success({
  //       message: "NFc-e emitida com sucesso!",
  //       duration: 5,
  //     });
  //   }
  // };

  return (
    <div>todo</div>
    // <Container
    //   title="Nfe"
    //   visible={modalState}
    //   destroyOnClose={true}
    //   closable={false}
    //   width={650}
    //   confirmLoading={emitingNfe}
    //   okButtonProps={{ disabled: !isValid }}
    //   centered
    //   footer={
    //     <Footer>
    //       <ButtonCancel onClick={() => setModalState(false)}>
    //         Cancelar
    //       </ButtonCancel>
    //       <ButtonSave onClick={() => handleEmit()}>Emitir</ButtonSave>
    //     </Footer>
    //   }
    // >
    //   <Form layout="vertical" form={form}>
    //     <Divider orientation="left" plain>
    //       Pagamento
    //     </Divider>
    //     <Row>
    //       <Col span={24}>
    //         <FormItem name="valorPagamento">
    //           <TotalValue disabled className="valorPagamento" />
    //         </FormItem>
    //       </Col>
    //       <Col span={12}>
    //         <FormItem
    //           label="Operação"
    //           name="formaPagamento"
    //           rules={[{ required: true }]}
    //         >
    //           <Select
    //             placeholder="Escolha a opção"
    //             onChange={(value) => handleUpdateNfe("formaPagamento", value)}
    //           >
    //             {formasPagamento.map((formaPagamento) => (
    //               <Option key={formaPagamento.id}>
    //                 {formaPagamento.value}
    //               </Option>
    //             ))}
    //           </Select>
    //         </FormItem>
    //       </Col>
    //       <Col span={12}>
    //         <FormItem
    //           label="Tipo"
    //           name="indicadorFormaPagamento"
    //           rules={[{ required: true }]}
    //         >
    //           <Select
    //             placeholder="Escolha a opção"
    //             onChange={(value) =>
    //               handleUpdateNfe("indicadorFormaPagamento", +value)
    //             }
    //           >
    //             {indicadoresFormaPagamento.map((indicadorFormaPagamento) => (
    //               <Option key={indicadorFormaPagamento.id}>
    //                 {indicadorFormaPagamento.value}
    //               </Option>
    //             ))}
    //           </Select>
    //         </FormItem>
    //       </Col>
    //       <Col span={12}>
    //         <FormItem label="Troco" name="troco" rules={[{ required: true }]}>
    //           <Input disabled />
    //         </FormItem>
    //       </Col>
    //       <Col span={12}>
    //         <FormItem label="CPF / CNPJ" name="CPFDestinatario">
    //           <Input
    //             placeholder="CPF/CNPJ"
    //             className="ant-input"
    //             onChange={({ target: { value } }) =>
    //               handleUpdateNfe("CPFDestinatario", value)
    //             }
    //           />
    //         </FormItem>
    //       </Col>
    //       <Col span={24}>
    //         <FormItem
    //           label="Informações Adicionais"
    //           name="informacoesAdicionaisFisco"
    //         >
    //           <Input.TextArea
    //             onChange={({ target: { value } }) =>
    //               handleUpdateNfe("informacoesAdicionaisFisco", value)
    //             }
    //           />
    //         </FormItem>
    //       </Col>
    //     </Row>
    //     <Divider orientation="left" plain>
    //       Produtos
    //     </Divider>
    //     {productsNfe?.map((productNfe) => (
    //       <Row key={productNfe.id}>
    //         <Col span={12}>
    //           <FormItem label="Produto">
    //             <Input disabled defaultValue={productNfe.descricao} />
    //           </FormItem>
    //         </Col>
    //         <Col span={6}>
    //           <FormItem label="Valor">
    //             <Input
    //               disabled
    //               defaultValue={productNfe.valorUnitarioComercial
    //                 ?.toFixed(2)
    //                 .replace(".", ",")}
    //             />
    //           </FormItem>
    //         </Col>
    //         <Col span={6}>
    //           <FormItem label="Qtd.">
    //             <Input
    //               disabled
    //               defaultValue={productNfe.quantidadeComercial
    //                 ?.toFixed(2)
    //                 .replace(".", ",")}
    //             />
    //           </FormItem>
    //         </Col>
    //       </Row>
    //     ))}
    //   </Form>
    // </Container>
  );
};

export default NfeForm;
