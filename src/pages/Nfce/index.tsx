import React, { useState, useEffect } from "react";
import axios from "axios";
import { onlyNumbers } from "../../helpers/onlyNumber";
import { cleanObject } from "../../helpers/cleanObject";
import { v4 } from "uuid";

import { Divider, message as messageAnt, Popover, Spin } from "antd";

import RouterDescription from "../../components/RouterDescription";
import CashNotFound from "../../components/CashNotFound";

import { ProductDto } from "../../models/dtos/product";
import { Nfe } from "../../models/dtos/nfe";
import { ProductNfe } from "../../models/dtos/productNfe";

import {
  Container,
  RightContainer,
  Content,
  LeftContainer,
  Col,
  Form,
  FormItem,
  Input,
  InputMonetary,
  Row,
  ProductsContainer,
  ProductsList,
  Product,
  AddIcon,
  InfoIcon,
  Option,
  InputMask,
  ActionContainer,
  Button,
  SpinContainer,
  TabContainer,
  TabItem,
  ProductHeader,
  ProductHeaderCol,
  ProductHeaderDescription,
  ProductList,
  ProductContainer,
  BalanceContainer,
  BalanceContent,
  TopContainer,
  Text,
  BottomContainer,
  PriceContainer,
  Price,
  ProductListContainer,
  ProductListHeader,
  ProductListRow,
  FormContainer,
  PriceTotalNfce,
  RemoveIcon,
  Select,
} from "./styles";

const Nfce: React.FC = () => {
  const [cashIsOpen, setCashIsOpen] = useState<boolean>(false);
  const [selfServiceAmount, setSelfServiceAmount] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [nfe, setNfe] = useState<Nfe | null>(null);
  const [emitingNfe, setEmitingNfe] = useState(false);
  const [productsNfe, setProductsNfe] = useState<ProductNfe[]>([]);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    async function init() {
      const _productsNfce = await window.Main.product.getAllProductStore();
      if (!_productsNfce) {
        messageAnt.error("Falha ao obter produtos para NFe");
      }
      setProducts(_productsNfce);
      const currentStoreCash = await window.Main.storeCash.getCurrent();
      if (currentStoreCash?.is_opened) {
        setCashIsOpen(true);
      } else {
        setCashIsOpen(false);
      }
      setLoading(false);
    }
    init();
  }, []);

  const findSelfService = (products: ProductDto[]): ProductDto => {
    return products.find((product) => product.product.category_id === 1);
  };

  const handleEnterToSubmit = () => {
    const selfService = findSelfService(products);

    const quantity = +(selfServiceAmount / +selfService?.price_unit).toFixed(4);

    handleSelectProduct(selfService, selfServiceAmount, quantity);
  };

  const handleUpdateNfe = (name, value) => {
    setNfe((oldValues) => ({ ...oldValues, [name]: value }));
  };

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

  const calculateTotal = (productsNfe: ProductNfe[]): string => {
    const total = productsNfe.reduce(
      (total, product) =>
        +product.quantidadeComercial && +product.valorUnitarioComercial
          ? +product.quantidadeComercial * +product.valorUnitarioComercial +
            total
          : total,
      0
    );
    form.setFieldsValue({
      valorPagamento: total.toFixed(2).replace(".", ","),
      totalProdutos: total.toFixed(2).replace(".", ","),
    });

    return total.toFixed(2).replace(".", ",");
  };

  const isValidProduct = (product: ProductDto) => {
    const errors: string[] = [];
    if (!product.product.cod_ncm) {
      errors.push("NCM");
    }
    if (!product.cfop) {
      errors.push("CFOP");
    }
    if (!product.unity_taxable) {
      errors.push("Unidade Tributável");
    }
    if (!product.price_unit) {
      errors.push("Valor de Venda");
    }
    if (!product.icms_origin && product.icms_origin !== 0) {
      errors.push("Origem");
    }
    if (!product.icms_tax_situation) {
      errors.push("Situação Tributária");
    }

    if (errors.length) {
      return {
        valid: false,
        message: `O produto ${
          product.product.name
        } não possui os dados ${errors.join(", ")}`,
      };
    }
    return { valid: true, message: null };
  };

  const handleSelectProduct = (
    product: ProductDto,
    price?: number,
    quantity?: number
  ) => {
    let _productsNfe = productsNfe;

    const productNfe: ProductNfe = {
      id: v4(),
      idItem: product.product_id,
      codigo: product.product_id,
      descricao: product.product.name,
      ncm: product.product.cod_ncm.toString(),
      cfop: product.cfop,
      unidadeComercial: product.unity_taxable?.toString(),
      quantidadeComercial: quantity || 1,
      valorUnitarioComercial: +product.price_unit,
      unidadeTributaria: product.unity_taxable?.toString(),
      quantidadeTributavel: quantity || 1,
      valorUnitarioTributario: +product.price_unit,
      origem: product.icms_origin,
      informacoesAdicionais: product.additional_information,
      PISCOFINSST: false,
      csosn: 102,
      cEAN: "SEM GTIN",
      cEANTrib: "SEM GTIN",
    };

    if (product.product.category_id === 1) {
      _productsNfe = [
        ..._productsNfe.filter(
          (productNfe) => productNfe.idItem !== product.product_id
        ),
        productNfe,
      ];
    } else {
      _productsNfe = [..._productsNfe, productNfe];
    }
    calculateTotal(_productsNfe);
    setProductsNfe(_productsNfe);
  };

  const handlerRemoveProduct = (id: string) => {
    const updatedProducts = productsNfe.filter(
      (productNfe) => productNfe.id !== id
    );
    calculateTotal(updatedProducts);
    setProductsNfe(updatedProducts);
  };

  // const handleEmit = () => {
  //   if (!productsNfe.length) {
  //     messageAnt.warning("Adicione pelo menos um produto");
  //     return;
  //   }
  //   const nfcePayload = {
  //     ...cleanObject(nfe),
  //     informacoesAdicionaisFisco:
  //       nfe.informacoesAdicionaisFisco || "Sem informacoes adicionais",
  //     valorPagamento: +calculateTotal(productsNfe).replace(",", "."),
  //     produtos: productsNfe.map(({ id, ...props }, index) => ({
  //       ...props,
  //       idItem: index + 1,
  //       quantidadeTributavel: props.quantidadeComercial,
  //     })),
  //   };

  //   console.log(JSON.stringify(nfcePayload));
  //   setEmitingNfe(true);
  //   ipcRenderer.send("sale:nfe", { nfce: nfcePayload });
  //   ipcRenderer.once("sale:nfe:response", (event, { error, message }) => {
  //     setEmitingNfe(false);
  //     if (error) {
  //       messageAnt.error(message || "Falha ao emitir NFCe, contate o suporte.");
  //     } else {
  //       messageAnt.success(message || "NFCe emitida com sucesso");
  //     }
  //   });
  // };

  const handleUpdateProduct = (id: string, value: number) => {
    if (value <= 0) {
      handlerRemoveProduct(id);
      return;
    }
    const _productsNfe = productsNfe;
    const productToUpdate = _productsNfe.find(
      (productNfe) => productNfe.id === id
    );
    productToUpdate.quantidadeComercial = value;

    const updatedProducts = [
      ..._productsNfe.filter((productNfe) => productNfe.id !== id),
      productToUpdate,
    ];
    calculateTotal(updatedProducts);
    setProductsNfe(updatedProducts);
  };

  // const productsFormater = (payload) => {
  //   let categories = payload.map((product) => ({
  //     id: product.product.category.id,
  //     name: product.product.category.name,
  //     products: [],
  //   }));

  //   categories = Array.from(
  //     new Set(categories.map((category) => category.id))
  //   ).map((id) => {
  //     return categories.find((category) => category.id === id);
  //   });

  //   categories = categories.map((category) => {
  //     const productsCategory = payload.filter(
  //       (product) => product.product.category.id === category.id
  //     );
  //     return {
  //       ...category,
  //       products: productsCategory,
  //     };
  //   });

  //   categories = categories.filter((category) => category.id !== 1);

  //   return categories as {
  //     id: number;
  //     name: string;
  //     products: ProductDto[];
  //   }[];
  // };

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

  return (
    <Container>
      <RouterDescription description="NFC-e" />
      {!loading ? (
        <>
          {cashIsOpen ? (
            <Content>
              <LeftContainer>
                <BalanceContainer>
                  <BalanceContent>
                    <TopContainer>
                      <Text>Preço total self-service</Text>
                      <InputMonetary
                        autoFocus={true}
                        id="balanceInput"
                        getValue={(value) => setSelfServiceAmount(+value)}
                        onEnterPress={handleEnterToSubmit}
                      />
                    </TopContainer>

                    <BottomContainer>
                      <PriceContainer>
                        <Text>Preço do KG</Text>
                        <Price>
                          R${" "}
                          {findSelfService(products).price_unit?.replace(
                            ".",
                            ","
                          )}
                        </Price>
                      </PriceContainer>
                    </BottomContainer>
                  </BalanceContent>
                </BalanceContainer>
                <ProductsContainer>
                  <TabContainer defaultActiveKey="1">
                    {/* {productsFormater(products).map((item, index) => (
                      <TabItem tab={item.name} key={index + 1}>
                        <ProductHeader>
                          <ProductHeaderCol span={15}>
                            <ProductHeaderDescription>
                              Produtos
                            </ProductHeaderDescription>
                          </ProductHeaderCol>
                          <ProductHeaderCol span={5}>
                            <ProductHeaderDescription>
                              Preço
                            </ProductHeaderDescription>
                          </ProductHeaderCol>
                          <ProductHeaderCol span={4}>
                            <ProductHeaderDescription>
                              Add
                            </ProductHeaderDescription>
                          </ProductHeaderCol>
                        </ProductHeader>
                        <ProductList>
                          {item.products.map((product) => (
                            <ProductContainer key={product.id}>
                              <ProductHeaderCol
                                span={15}
                                style={{ textTransform: "capitalize" }}
                              >
                                {product.product.name}
                              </ProductHeaderCol>
                              <ProductHeaderCol span={5}>
                                {product.price_unit?.replace(".", ",")}
                              </ProductHeaderCol>
                              <ProductHeaderCol span={4}>
                                {isValidProduct(product).valid ? (
                                  <>
                                    {!productsNfe.some(
                                      (productNfe) =>
                                        productNfe.idItem === product.product_id
                                    ) && (
                                      <AddIcon
                                        onClick={() =>
                                          handleSelectProduct(product)
                                        }
                                      />
                                    )}
                                  </>
                                ) : (
                                  <Popover
                                    content={isValidProduct(product).message}
                                  >
                                    <InfoIcon />
                                  </Popover>
                                )}
                              </ProductHeaderCol>
                            </ProductContainer>
                          ))}
                        </ProductList>
                      </TabItem>
                    ))} */}
                  </TabContainer>
                </ProductsContainer>
              </LeftContainer>

              <RightContainer>
                <ProductListContainer>
                  <ProductListHeader>
                    <ProductListRow>
                      <ProductHeaderCol span={6}>
                        <ProductHeaderDescription>
                          Produtos
                        </ProductHeaderDescription>
                      </ProductHeaderCol>
                      <ProductHeaderCol span={4}>
                        <ProductHeaderDescription>
                          Qtd.
                        </ProductHeaderDescription>
                      </ProductHeaderCol>
                      <ProductHeaderCol span={5}>
                        <ProductHeaderDescription>
                          Valor Unit.
                        </ProductHeaderDescription>
                      </ProductHeaderCol>
                      <ProductHeaderCol span={5}>
                        <ProductHeaderDescription>
                          Valor Total
                        </ProductHeaderDescription>
                      </ProductHeaderCol>
                      <ProductHeaderCol span={4}>
                        <ProductHeaderDescription>
                          Ação
                        </ProductHeaderDescription>
                      </ProductHeaderCol>
                    </ProductListRow>
                  </ProductListHeader>

                  <ProductsList>
                    {productsNfe.map((product) => (
                      <Product key={product.id}>
                        <ProductHeaderCol
                          span={6}
                          style={{ textTransform: "capitalize" }}
                        >
                          {product.descricao}
                        </ProductHeaderCol>
                        <ProductHeaderCol span={4}>
                          {product.idItem === 1 ? (
                            <span>{product.quantidadeComercial}KG</span>
                          ) : (
                            <Input
                              type="number"
                              defaultValue={product.quantidadeComercial}
                              onChange={({ target: { value } }) =>
                                handleUpdateProduct(product.id, +value)
                              }
                              style={{ width: "75px" }}
                            />
                          )}
                        </ProductHeaderCol>
                        <ProductHeaderCol span={5}>
                          {product.valorUnitarioComercial
                            .toFixed(2)
                            .replace(".", ",")}
                        </ProductHeaderCol>
                        <ProductHeaderCol span={5}>
                          {(
                            product.valorUnitarioComercial *
                            product.quantidadeComercial
                          )
                            .toFixed(2)
                            .replace(".", ",")}
                        </ProductHeaderCol>

                        <ProductHeaderCol span={4}>
                          <RemoveIcon
                            onClick={() => handlerRemoveProduct(product.id)}
                          />
                        </ProductHeaderCol>
                      </Product>
                    ))}
                  </ProductsList>
                </ProductListContainer>

                <FormContainer>
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
                            {indicadoresFormaPagamento.map(
                              (indicadorFormaPagamento) => (
                                <Option key={indicadorFormaPagamento.id}>
                                  {indicadorFormaPagamento.value}
                                </Option>
                              )
                            )}
                          </Select>
                        </FormItem>
                      </Col>
                      <Col span={5}>
                        <FormItem
                          label="Forma"
                          name="formaPagamento"
                          rules={[{ required: true }]}
                        >
                          <Select
                            onChange={(value) =>
                              handleUpdateNfe("formaPagamento", value)
                            }
                          >
                            {formasPagamento.map((formaPagamento) => (
                              <Option key={formaPagamento.id}>
                                {formaPagamento.value}
                              </Option>
                            ))}
                          </Select>
                        </FormItem>
                      </Col>
                      <Col span={0}>
                        <FormItem
                          label="Valor"
                          name="valorPagamento"
                          rules={[{ required: true }]}
                        >
                          <Input disabled />
                        </FormItem>
                      </Col>
                      <Col span={4}>
                        <FormItem
                          label="Troco"
                          name="troco"
                          rules={[{ required: true }]}
                        >
                          <InputMonetary
                            getValue={(value) =>
                              handleUpdateNfe("troco", +value)
                            }
                          />
                        </FormItem>
                      </Col>
                      <Col span={5}>
                        <FormItem label="Total" name="totalProdutos">
                          <Input
                            disabled
                            style={{
                              background: "orange",
                              color: "white",
                              fontWeight: "bolder",
                            }}
                          />
                        </FormItem>
                      </Col>
                      <>
                        {emitingNfe ? (
                          <Col
                            span={4}
                            style={{
                              display: "flex",
                              alignItems: "flex-end",
                              justifyContent: "center",
                              margin: "5px",
                            }}
                          >
                            <PriceTotalNfce style={{ background: "#f4f4f4" }}>
                              <Spin />
                            </PriceTotalNfce>
                          </Col>
                        ) : (
                          <Col
                            span={4}
                            style={{
                              display: "flex",
                              alignItems: "flex-end",
                              justifyContent: "center",
                              margin: "5px",
                            }}
                          >
                            {/* <Button type="primary" onClick={() => handleEmit()}>
                              Emitir
                            </Button> */}
                          </Col>
                        )}
                      </>
                    </Row>

                    <Divider orientation="left" plain>
                      Destinatário
                    </Divider>

                    <Row>
                      <Col span={4}>
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
                      <Col span={6}>
                        <FormItem label="Nome" name="nomeDestinatario">
                          <Input
                            onChange={({ target: { value } }) =>
                              handleUpdateNfe("nomeDestinatario", value)
                            }
                          />
                        </FormItem>
                      </Col>
                      <Col span={4}>
                        <FormItem
                          label="CEP"
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                        >
                          <InputMask
                            mask="99999-999"
                            className="ant-input"
                            onChange={({ target: { value } }) =>
                              handleCep(onlyNumbers(value).toString())
                            }
                          />
                        </FormItem>
                      </Col>
                      <Col span={4}>
                        <FormItem
                          label="Municipio"
                          name="municipioDestinatario"
                        >
                          <Input disabled />
                        </FormItem>
                      </Col>
                      <Col span={6}>
                        <FormItem
                          label="Logradouro"
                          name="logradouroDestinatario"
                        >
                          <Input disabled />
                        </FormItem>
                      </Col>
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
                          <Input.TextArea
                            rows={2}
                            onChange={({ target: { value } }) =>
                              handleUpdateNfe(
                                "informacoesAdicionaisFisco",
                                value
                              )
                            }
                          />
                        </FormItem>
                      </Col>
                    </Row>
                  </Form>
                </FormContainer>
              </RightContainer>
            </Content>
          ) : (
            <CashNotFound />
          )}
        </>
      ) : (
        <SpinContainer>
          <Spin />
        </SpinContainer>
      )}
    </Container>
  );
};

export default Nfce;
