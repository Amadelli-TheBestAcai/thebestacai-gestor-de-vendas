import React, { useState, useEffect } from 'react';
import { cleanObject } from '../../helpers/cleanObject';

import { Tooltip, notification, Radio } from 'antd';

import CashNotFound from '../../components/CashNotFound';
import Spinner from '../../components/Spinner';
import DisconectedForm from '../../containers/DisconectedForm';

import { ProductNfe } from '../../models/dtos/productNfe';
import { StoreProductDto } from '../../models/dtos/storeProduct';
import { Nfe } from '../../models/dtos/nfe';

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
  ContainerNotSelfService,
} from './styles';
import { FlagCard } from '../../models/enums/flagCard';
import { useStore } from '../../hooks/useStore';

const Nfce: React.FC = () => {
  const [cashIsOpen, setCashIsOpen] = useState<boolean>(false);
  const [selfServiceAmount, setSelfServiceAmount] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingButtonSubmit, setLoadingButtonSubmit] =
    useState<boolean>(false);
  const [nfe, setNfe] = useState<Nfe | null>(null);
  const [productsNfe, setProductsNfe] = useState<ProductNfe[]>([]);
  const [products, setProducts] = useState<StoreProductDto[]>([]);
  const [isConected, setIsConected] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [shouldSearch, setShouldSearch] = useState(true);
  const [paymentType, setPaymentType] = useState<number>(0);
  const [form] = Form.useForm();
  const { store } = useStore();
  const [selectedSelfService, setSelectedSelfService] = useState<number>(1);

  useEffect(() => {
    async function init() {
      setLoadingButtonSubmit(true);
      const { response: products, has_internal_error: errorOnProducts } =
        await window.Main.product.getProducts(true);
      if (errorOnProducts) {
        notification.error({
          message: 'Erro ao encontrar todos produtos',
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
        setShouldSearch(false);
        setLoadingButtonSubmit(false);
      } else {
        setCashIsOpen(false);
      }
      setLoading(false);
    }

    if (shouldSearch) {
      init();
    }
  }, [shouldSearch]);

  const findSelfService = (
    products: StoreProductDto[],
    productId: number
  ): StoreProductDto => {
    return products?.find((product) => product.product_id === productId);
  };

  const getProductIdByName = (name: string) => {
    const product = products.find((product) => product.product.name === name);
    return product ? product.product_id : null;
  };

  const selfServiceOptions = [
    { name: 'Self-service', id: 1 },
    { name: 'Açaí Self-service', id: getProductIdByName('açaí self service') },
    {
      name: 'Sorvete Self-service',
      id: getProductIdByName('sorvete self service'),
    },
  ];

  const handleEnterToSubmit = () => {
    if (selfServiceAmount !== 0) {
      const selfService = findSelfService(products, selectedSelfService);

      const quantity = +(selfServiceAmount / +selfService?.price_unit).toFixed(
        4
      );

      handleSelectProduct(selfService, quantity);
      setSelfServiceAmount(0);
    } else {
      notification.error({
        message: 'Digite um valor',
        duration: 5,
      });
    }
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
      valorPagamento: total.toFixed(2).replace('.', ','),
      totalProdutos: total.toFixed(2).replace('.', ','),
    });

    return total.toFixed(2).replace('.', ',');
  };

  const handleSelectProduct = (product: StoreProductDto, quantity?: number) => {
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
    await form.validateFields();
    let payload = await form.getFieldsValue();
    if (!payload.formaPagamento) {
      return notification.warning({
        message: 'Selecione a forma de pagamento',
        duration: 5,
      });
    }
    const validationCpfOrCnpj =
      payload.cpf?.replace(/[^0-9]+/g, '')?.length === 11 ||
      payload.cpf?.replace(/[^0-9]+/g, '')?.length === 14;

    if (payload.cpf) {
      if (!validationCpfOrCnpj) {
        return notification.warning({
          message: 'CPF ou CNPJ inválido',
          duration: 5,
        });
      }
    }
    if (!productsNfe.length) {
      return notification.warning({
        message: 'Oops! O carrinho está vazio.',
        description: `Selecione algum item para continuar com a emissão da nota.`,
        duration: 5,
      });
    }

    const totalSold = +payload.totalProdutos.replace(',', '.');

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
      setLoadingButtonSubmit(true);
      const {
        response,
        has_internal_error: errorOnEmitNfce,
        error_message,
      } = await window.Main.sale.emitNfce(nfcePayload);

      if (errorOnEmitNfce) {
        if (error_message === 'Store token not found.') {
          notification.error({
            message: 'O token da nota fiscal não está cadastrado na loja.',
            duration: 5,
          });
          return;
        }

        notification.error({
          message: error_message || 'Erro ao emitir NFCe',
          duration: 5,
        });
        return;
      }

      const successOnSefaz = response?.status_sefaz === '100';
      notification[successOnSefaz ? 'success' : 'warning']({
        message: response?.mensagem_sefaz,
        duration: 5,
      });

      setModalState(true);
      setProductsNfe([]);
      form.resetFields();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingButtonSubmit(false);
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
    { id: 0, value: 'Dinheiro' },
    { id: 1, value: 'Cartão de Crédito' },
    { id: 2, value: 'Cartão de Débito' },
    { id: 3, value: 'Ticket' },
    { id: 5, value: 'Boleto' },
    { id: 6, value: 'Pix' },
    { id: 7, value: 'Transferencia' },
  ];

  const newNfce = () => {
    cleanObject(nfe);
    setModalState(false);
    setShouldSearch(true);
  };

  const isProductEnabled = (productId) => {
    return products.some((product) => product.product_id === productId);
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
                            <Radio.Group
                              onChange={(e) =>
                                setSelectedSelfService(e.target.value)
                              }
                              value={selectedSelfService}
                            >
                              {selfServiceOptions.map((option) => (
                                <Tooltip
                                  key={option.id}
                                  title={
                                    !isProductEnabled(option.id)
                                      ? 'Produto não habilitado. Habilite o produto no Dashboard, na aba de Produtos do Gestor.'
                                      : ''
                                  }
                                >
                                  <Radio
                                    value={option.id}
                                    disabled={!isProductEnabled(option.id)}
                                  >
                                    {option.name}
                                  </Radio>
                                </Tooltip>
                              ))}
                            </Radio.Group>
                            <PriceContent>
                              <div>
                                <span>
                                  Preço total (
                                  {selectedSelfService === 1
                                    ? 'Self-Service'
                                    : selectedSelfService === 370
                                    ? 'Açaí Self-service'
                                    : 'Sorvete Self-service'}
                                  )
                                </span>
                                {isProductEnabled(selectedSelfService) ? (
                                  <InputMonetary
                                    autoFocus={true}
                                    id="balanceInput"
                                    getValue={(value) =>
                                      setSelfServiceAmount(+value)
                                    }
                                    onEnterPress={handleEnterToSubmit}
                                  />
                                ) : (
                                  <Tooltip
                                    title={
                                      'Produto não habilitado. Habilite o produto no Dashboard, na aba de Produtos do Gestor.'
                                    }
                                  >
                                    <ContainerNotSelfService>
                                      <input type="text" disabled />
                                    </ContainerNotSelfService>
                                  </Tooltip>
                                )}
                              </div>
                              <WeightContent>
                                <span>Preço do KG</span>
                                <InfoWeight>
                                  R${' '}
                                  {findSelfService(
                                    products,
                                    selectedSelfService
                                  )?.price_unit?.replace('.', ',')}
                                </InfoWeight>
                              </WeightContent>
                            </PriceContent>
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
                                            '.',
                                            ','
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
                                      {product.id === 1 ||
                                      product.id === 370 ||
                                      product.id === 371 ? (
                                        <span>{product.quantity}KG</span>
                                      ) : (
                                        <span>{product.quantity}</span>
                                      )}
                                    </ProductColumn>
                                    <ProductColumn span={4}>
                                      <span>
                                        {product.price_sell
                                          .toFixed(2)
                                          .replace('.', ',')}
                                      </span>
                                    </ProductColumn>
                                    <ProductColumn span={4}>
                                      <span>
                                        R${' '}
                                        {(product.price_sell * product.quantity)
                                          .toFixed(2)
                                          .replace('.', ',')}
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
                            <Form
                              layout="vertical"
                              form={form}
                              preserve={false}
                            >
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
                                    rules={[
                                      {
                                        required: true,
                                        message:
                                          'Forma de pagamento é obrigatória',
                                      },
                                    ]}
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
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            'Bandeira do cartão é obrigatória',
                                        },
                                      ]}
                                    >
                                      <Select
                                        placeholder="Escolha a opção"
                                        onChange={(value) =>
                                          handleUpdateNfe(
                                            'bandeira_operadora',
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
                                        handleUpdateNfe('discount', value)
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
                                          'CPFDestinatario',
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
                                        handleUpdateNfe('email', value)
                                      }
                                    />
                                  </FormItem>
                                </Col>
                              </Row>
                              <ButtonFinishContent>
                                <Button
                                  type="primary"
                                  onClick={() => handleEmit()}
                                  loading={loadingButtonSubmit}
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
                      <CashNotFound description="Nenhum caixa aberto no momento. Abra o caixa para iniciar as vendas." />
                    </>
                  )}
                </>
              </>
            ) : (
              <>
                {' '}
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
