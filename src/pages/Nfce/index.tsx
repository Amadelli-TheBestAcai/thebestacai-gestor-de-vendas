import React, { useState, useEffect } from "react";
import { cleanObject } from "../../helpers/cleanObject";
import { v4 } from "uuid";

import { Popover, Tooltip, notification } from "antd";

import CashNotFound from "../../components/CashNotFound";
import Spinner from "../../components/Spinner";
import DisconectedForm from "../../containers/DisconectedForm";

import { ProductNfe } from "../../models/dtos/productNfe";
import { ProductDto } from "../../models/dtos/product";
import { Nfe } from "../../models/dtos/nfe";

import {
  Container,
  PageContent,
  Header,
  Content,
  LeftContainer,
  RightContainer,
  BalanceContainer,
  PriceContent,
  WeightContent,
  InputMonetary,
  InfoWeight,
  ItemsContainer,
  IconContainer,
  InputSearchProduct,
  ProductSearch,
  SearchIcon,
  TabContainer,
  TabItem,
  Column,
  HeaderItem,
  ColumnProduct,
  ProductContainer,
  ProductContent,
  AddIcon,
  InfoIcon,
  ProductListContainer,
  ProductListHeader,
  ProductColumn,
  ProductsList,
  ProductsContent,
  Product,
  Input,
  FormContainer,
  Row,
  Col,
  FormItem,
  TotalValue,
  Select,
  Option,
  ButtonFinishContent,
  Button,
  Form,
  DeleteButton,
  DeleteIcon,
  ModalNFCe,
  NFCeButton,
} from "./styles";
import { FlagCard } from "../../models/enums/flagCard";
import { useStore } from "../../hooks/useStore";

const Nfce: React.FC = () => {
  const [cashIsOpen, setCashIsOpen] = useState<boolean>(false);
  const [selfServiceAmount, setSelfServiceAmount] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nfe, setNfe] = useState<Nfe | null>(null);
  const [productsNfe, setProductsNfe] = useState<ProductNfe[]>([]);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [isConected, setIsConected] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [shouldSearch, setShouldSearch] = useState(true);
  const [paymentType, setPaymentType] = useState<number>(0);
  const [form] = Form.useForm();
  const { store } = useStore();

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      const { response: products, has_internal_error: errorOnProducts } =
        await window.Main.product.getProducts();
      if (errorOnProducts) {
        notification.error({
          message: "Erro ao encontrar todos produtos",
          duration: 5,
        });
      }
      const _isConnected = await window.Main.hasInternet();
      setProducts(products);
      setIsConected(_isConnected);
      const { response: currentStoreCash } =
        await window.Main.storeCash.getCurrent();
      if (currentStoreCash?.is_opened) {
        setCashIsOpen(true);
        setLoading(false);
        setShouldSearch(false);
        setIsLoading(false);
      } else {
        setCashIsOpen(false);
      }
    }

    if (shouldSearch) {
      init();
    }
  }, [shouldSearch]);

  const findSelfService = (products: ProductDto[]): ProductDto => {
    return products?.find((product) => product.product.category_id === 1);
  };

  const handleEnterToSubmit = () => {
    const selfService = findSelfService(products);

    const quantity = +(selfServiceAmount / +selfService?.price_unit).toFixed(4);

    handleSelectProduct(selfService, quantity);
  };

  const handleUpdateNfe = (name, value) => {
    setNfe((oldValues) => ({ ...oldValues, [name]: value }));
  };

  const calculateTotal = (productsNfe: ProductNfe[]): string => {
    const total = productsNfe.reduce(
      (total, product) => +product.quantity * +product.price_sell + total,
      0
    );
    form.setFieldsValue({
      valorPagamento: total.toFixed(2).replace(".", ","),
      totalProdutos: total.toFixed(2).replace(".", ","),
    });

    return total.toFixed(2).replace(".", ",");
  };

  const handleSelectProduct = (product: ProductDto, quantity?: number) => {
    let _productsNfe = productsNfe;

    const registredProductNfe = productsNfe.find(
      (productNfce) => productNfce.id === product.product_id
    );
    if (registredProductNfe) {
      registredProductNfe.quantity += 1;
      _productsNfe = [
        ...productsNfe.filter(
          (productNfce) => productNfce.id !== product.product_id
        ),
        registredProductNfe,
      ];
    } else {
      const productNfe: ProductNfe = {
        id: product.product_id,
        name: product.product.name,
        product_store_id: product.id,
        price_sell: +product.price_unit,
        quantity: quantity || 1,
      };

      if (product.product.category_id === 1) {
        _productsNfe = [
          ..._productsNfe.filter(
            (productNfe) => productNfe.id !== product.product_id
          ),
          productNfe,
        ];
      } else {
        _productsNfe = [..._productsNfe, productNfe];
      }
    }
    calculateTotal(_productsNfe);
    setProductsNfe(_productsNfe);
  };

  const handlerRemoveProduct = (id: number) => {
    const updatedProducts = productsNfe.filter(
      (productNfe) => productNfe.id !== id
    );
    calculateTotal(updatedProducts);
    setProductsNfe(updatedProducts);
  };

  const handleEmit = async () => {
    let payload = form.getFieldsValue();
    if (!productsNfe.length) {
      return notification.warning({
        message: "Oops! O carrinho está vazio.",
        description: `Selecione algum item para continuar com a emissão da nota.`,
        duration: 5,
      });
    }

    const totalSold = +payload.totalProdutos.replace(",", ".");

    const nfcePayload = {
      cpf: payload.cpf,
      email: payload.email,
      store_id: store.company_id,
      total: totalSold,
      discount: nfe.discount || 0,
      items: productsNfe.map((productNfe) => ({
        product_store_id: productNfe.product_store_id,
        price_sell: productNfe.price_sell * productNfe.quantity,
        quantity: productNfe.quantity,
      })),
      payments: [
        {
          amount: totalSold,
          type: +payload.formaPagamento,
          flag_card:
            paymentType === 1 || paymentType === 2
              ? +payload.bandeira_operadora
              : null,
        },
      ],
    };

    try {
      setIsLoading(true);

      console.log({ nfce_payload: JSON.stringify(nfcePayload) });

      const {
        response,
        has_internal_error: errorOnEmitNfce,
        error_message,
      } = await window.Main.sale.emitNfce(nfcePayload);

      if (errorOnEmitNfce) {
        notification.error({
          message: error_message || "Erro ao emitir NFCe",
          duration: 5,
        });
        return;
      }

      notification.success({
        message: response,
        duration: 5,
      });

      setModalState(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const productsFormater = (payload) => {
    let categories = payload?.map((product) => ({
      id: product.product.category.id,
      name: product.product.category.name,
      products: [],
    }));

    categories = Array.from(
      new Set(categories?.map((category) => category.id))
    ).map((id) => {
      return categories.find((category) => category.id === id);
    });

    categories = categories.map((category) => {
      const productsCategory = payload.filter(
        (product) => product.product.category.id === category.id
      );
      return {
        ...category,
        products: productsCategory,
      };
    });

    categories = categories.filter((category) => category.id !== 1);

    return categories;
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

  const newNfce = () => {
    cleanObject(nfe);
    setModalState(false);
    setShouldSearch(true);
  };

  return (
    <Container>
      <PageContent>
        {loading ? (
          <>
            <Spinner />
          </>
        ) : (
          <>
            {isConected ? (
              <>
                <>
                  {cashIsOpen ? (
                    <>
                      <Header>
                        <h2>Emissão NFC-e</h2>
                      </Header>
                      <Content>
                        <LeftContainer>
                          <BalanceContainer>
                            <PriceContent>
                              <span>Preço total self-service</span>
                              <InputMonetary
                                autoFocus={true}
                                id="balanceInput"
                                getValue={(value) =>
                                  setSelfServiceAmount(+value)
                                }
                                onEnterPress={handleEnterToSubmit}
                              />
                            </PriceContent>
                            <WeightContent>
                              <span>Preço do KG</span>
                              <InfoWeight>
                                R${" "}
                                {findSelfService(products)?.price_unit?.replace(
                                  ".",
                                  ","
                                )}
                              </InfoWeight>
                            </WeightContent>
                          </BalanceContainer>

                          <ItemsContainer>
                            <TabContainer defaultActiveKey="1">
                              {productsFormater(products).map((item, index) => (
                                <TabItem tab={item.name} key={index + 1}>
                                  <ProductSearch>
                                    <IconContainer>
                                      <SearchIcon />
                                    </IconContainer>
                                    <InputSearchProduct placeholder="Procurar item" />
                                  </ProductSearch>

                                  <HeaderItem>
                                    <Column sm={11}>Produto</Column>
                                    <Column sm={8}>Preço</Column>
                                    <Column sm={5}>Ação</Column>
                                  </HeaderItem>

                                  <ProductContainer>
                                    {item.products.map((product) => (
                                      <ProductContent key={product.id}>
                                        <ColumnProduct span={11}>
                                          {product.product.name}
                                        </ColumnProduct>
                                        <ColumnProduct span={8}>
                                          {product.price_unit?.replace(
                                            ".",
                                            ","
                                          )}
                                        </ColumnProduct>
                                        <ColumnProduct span={5}>
                                          <AddIcon
                                            onClick={() =>
                                              handleSelectProduct(product)
                                            }
                                          />
                                        </ColumnProduct>
                                      </ProductContent>
                                    ))}
                                  </ProductContainer>
                                </TabItem>
                              ))}
                            </TabContainer>
                          </ItemsContainer>
                        </LeftContainer>

                        <RightContainer>
                          <ProductListContainer>
                            <ProductListHeader>
                              <ProductColumn span={10}>Produto</ProductColumn>
                              <ProductColumn span={4}>Quantidade</ProductColumn>
                              <ProductColumn span={4}>
                                Valor Unitário
                              </ProductColumn>
                              <ProductColumn span={4}>
                                Valor Total
                              </ProductColumn>
                              <ProductColumn span={2}>Ação</ProductColumn>
                            </ProductListHeader>

                            <ProductsList>
                              <ProductsContent>
                                {productsNfe.map((product) => (
                                  <Product key={product.id}>
                                    <ProductColumn span={10}>
                                      <span>{product.name}</span>
                                    </ProductColumn>
                                    <ProductColumn span={4}>
                                      {product.id === 1 ? (
                                        <span>{product.quantity}KG</span>
                                      ) : (
                                        <span>{product.quantity}</span>
                                      )}
                                    </ProductColumn>
                                    <ProductColumn span={4}>
                                      <span>
                                        {product.price_sell
                                          .toFixed(2)
                                          .replace(".", ",")}
                                      </span>
                                    </ProductColumn>
                                    <ProductColumn span={4}>
                                      <span>
                                        R${" "}
                                        {(product.price_sell * product.quantity)
                                          .toFixed(2)
                                          .replace(".", ",")}
                                      </span>
                                    </ProductColumn>
                                    <ProductColumn span={2}>
                                      <Tooltip
                                        title="Remover"
                                        placement="bottom"
                                      >
                                        <DeleteButton
                                          onClick={() =>
                                            handlerRemoveProduct(product.id)
                                          }
                                        >
                                          <DeleteIcon />
                                        </DeleteButton>
                                      </Tooltip>
                                    </ProductColumn>
                                  </Product>
                                ))}
                              </ProductsContent>
                            </ProductsList>
                          </ProductListContainer>

                          <FormContainer>
                            <Form layout="vertical" form={form}>
                              <Row>
                                <Col span={24}>
                                  <FormItem name="totalProdutos">
                                    <TotalValue
                                      disabled
                                      className="totalValue"
                                    />
                                  </FormItem>
                                </Col>
                                <Col span={6}>
                                  <FormItem
                                    label="Forma de Pagamento"
                                    name="formaPagamento"
                                    rules={[{ required: true }]}
                                  >
                                    <Select
                                      placeholder="Escolha a opção"
                                      onChange={(value) =>
                                        setPaymentType(+value)
                                      }
                                      value={paymentType}
                                    >
                                      {formasPagamento.map((formaPagamento) => (
                                        <Option key={formaPagamento.id}>
                                          {formaPagamento.value}
                                        </Option>
                                      ))}
                                    </Select>
                                  </FormItem>
                                </Col>
                                {(paymentType === 1 || paymentType === 2) && (
                                  <Col span={6}>
                                    <FormItem
                                      label="Bandeira do cartão"
                                      name="bandeira_operadora"
                                      rules={[{ required: true }]}
                                    >
                                      <Select
                                        placeholder="Escolha a opção"
                                        onChange={(value) =>
                                          handleUpdateNfe(
                                            "bandeira_operadora",
                                            value
                                          )
                                        }
                                      >
                                        {FlagCard.map((_flagCard) => (
                                          <Option key={_flagCard.id}>
                                            {_flagCard.value}
                                          </Option>
                                        ))}
                                      </Select>
                                    </FormItem>
                                  </Col>
                                )}
                                <Col span={6}>
                                  <FormItem label="Desconto" name="discount">
                                    <InputMonetary
                                      getValue={(value) =>
                                        handleUpdateNfe("discount", value)
                                      }
                                    />
                                  </FormItem>
                                </Col>

                                <Col span={6}>
                                  <FormItem label="CPF / CNPJ" name="cpf">
                                    <Input
                                      placeholder="CPF/CNPJ"
                                      className="ant-input"
                                      onChange={({ target: { value } }) =>
                                        handleUpdateNfe(
                                          "CPFDestinatario",
                                          value
                                        )
                                      }
                                    />
                                  </FormItem>
                                </Col>
                                <Col span={6}>
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
                              </Row>
                              <ButtonFinishContent>
                                <Button
                                  type="primary"
                                  onClick={() => handleEmit()}
                                  loading={isLoading}
                                >
                                  Emitir Nota [F1]
                                </Button>
                              </ButtonFinishContent>
                            </Form>
                          </FormContainer>
                        </RightContainer>
                      </Content>
                    </>
                  ) : (
                    <>
                      <CashNotFound />
                    </>
                  )}
                </>
              </>
            ) : (
              <>
                {" "}
                <DisconectedForm />
              </>
            )}
          </>
        )}
      </PageContent>

      <ModalNFCe
        title="Emissão NFC-e"
        visible={modalState}
        onCancel={() => setModalState(false)}
        closable={true}
        centered
        width={500}
        footer={[
          <NFCeButton onClick={() => newNfce()}>Emitir outra</NFCeButton>,
        ]}
      >
        Nota fiscal emitida com sucesso.
      </ModalNFCe>
    </Container>
  );
};

export default Nfce;
