import React, { useState, useEffect, Dispatch, SetStateAction } from "react";

import { currencyFormater } from "../../helpers/currencyFormater";
import { replaceSpecialChars } from "../../helpers/replaceSpecialChars";
import { ReasonOutValue } from "../../models/enums/reasonSangria";

import MonetaryInput from "../../components/MonetaryInput";

import { message, Form } from "antd";

import {
  Container,
  Footer,
  ButtonSave,
  ButtonCancel,
  Content,
  Row,
  Col,
  Select,
  Option,
  Input,
} from "./styles";

type IProps = {
  modalState: boolean;
  type: string;
  setModalState: Dispatch<SetStateAction<boolean>>;
};

type ShopInfo = {
  category_id?: number;
  product_id?: number;
  unitary_value?: number;
  quantity?: number;
  observation?: string;
};

const InOutForm: React.FC<IProps> = ({ modalState, setModalState, type }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [productsCategory, setProductsCategory] = useState([]);
  const [hasInternet, setHasInternet] = useState(false);
  const [fetchingProductsCategory, setFetchingProductsCategory] =
    useState(true);
  const [value, setValue] = useState<number>();
  const [reasson, setReasson] = useState<string>();
  const [reasontype, setReasonType] = useState<string>();
  const [shopInfo, setShopInfo] = useState<ShopInfo | null>(null);
  const [store, setStore] = useState<number | null>(null);

  const shopIsValid = (order): boolean => {
    return (
      !!order.store_id &&
      !!order.due_date &&
      !!order.pay_date &&
      !!order.total &&
      (!!order.observation || order.purchasesItems[0].observation) &&
      !!order.purchasesItems[0].product_id &&
      !!order.purchasesItems[0].quantity &&
      !!order.purchasesItems[0].unitary_value &&
      !!order.purchasesItems[0].category_id
    );
  };

  const handleSubmit = () => {
    if (loading) {
      return;
    }
    let sendToShop =
      type !== "entrada" &&
      hasInternet &&
      (reasontype === "Pagamento fornecedor" ||
        reasontype === "Pagamento freelance");

    let shopOrder = null;

    if (type !== "entrada" && sendToShop) {
      if (reasontype === "Pagamento fornecedor") {
        shopOrder = {
          store_id: store,
          due_date: new Date(),
          pay_date: new Date(),
          payment_method: 0,
          total: +shopInfo.quantity * +shopInfo.unitary_value,
          observation: shopInfo.observation,
          name: "Pagamento fornecedor",
          purchasesItems: [
            {
              product_id: +shopInfo.product_id,
              quantity: +shopInfo.quantity,
              unitary_value: +shopInfo.unitary_value,
              category_id: +shopInfo.category_id,
            },
          ],
        };
      }
      if (reasontype === "Pagamento freelance") {
        const category = productsCategory.find(
          (category) => category.name === "Salarios/Comissões"
        );
        const product = category.products.find(
          (product) =>
            replaceSpecialChars(product.name.toLowerCase()) === "freelancer"
        );
        if (!category || !product) {
          sendToShop = false;
        }
        shopOrder = {
          store_id: store,
          due_date: new Date(),
          pay_date: new Date(),
          payment_method: 0,
          total: +shopInfo.quantity * +shopInfo.unitary_value,
          name: "Salarios/Comissões",
          purchasesItems: [
            {
              product_id: +product.id,
              quantity: +shopInfo.quantity,
              unitary_value: +shopInfo.unitary_value,
              category_id: +category.id,
              observation: `Nome: ${shopInfo.observation}`,
            },
          ],
        };
      }
      if (!shopIsValid(shopOrder)) {
        return message.warning("Preencha todos os campos corretamente.");
      }
    }

    if (!value && !shopOrder.total) {
      return message.warning("Informe um valor");
    } else if (!reasson && !reasontype) {
      return message.warning("Informe a razão");
    }
    const payload = {
      handler: {
        type,
        reason: reasontype === "Outros" ? reasson : reasontype,
        amount: +shopOrder?.total || value,
      },
      shopOrder,
      sendToShop,
    };

    console.log(JSON.stringify(payload));
    setLoading(true);
    // ipcRenderer.send("handler:create", payload);
    // ipcRenderer.once("handler:create:response", (event, { success }) => {
    //   if (success) {
    //     setValue(null);
    //     setReasson(null);
    //     setReasonType(null);
    //     message.success("Movimentação cadastrada com sucesso");
    //     setLoading(false);
    //     setModalState(false);
    //     return document.getElementById("mainContainer").focus();
    //   }
    //   message.warning("Erro ao cadastrar movimentação");
    //   document.getElementById("mainContainer").focus();
    // });
  };

  const handleSelect = (value) => {
    setReasonType(value);
  };

  const handleClose = (): void => {
    //document.getElementById("mainContainer").focus();
    setModalState(false);
    setValue(null);
    setReasson(null);
    setReasonType(null);
  };

  const getAmount = (amount: number): void => {
    setValue(amount);
  };

  const inValue = [
    { id: "Troco", value: "Troco" },
    { id: "Outros", value: "Outros" },
  ];

  const outValue = [
    { id: "Sangria", value: "Sangria" },
    { id: "Pagamento fornecedor", value: "Pagamento fornecedor" },
    { id: "Pagamento freelance", value: "Pagamento freelance" },
    { id: "Troco", value: "Troco" },
    { id: "Outros", value: "Outros" },
  ];

  useEffect(() => {
    setShopInfo(null);
    setReasonType("");
    async function init() {
      const hasInternet = await window.Main.hasInternet();
      const store = await window.Main.store.registratedStore();
      const purchaseProducts =
        await window.Main.product.getAllPurchaseProducts();
      setStore(store?.id);
      setProductsCategory(purchaseProducts);
      setHasInternet(hasInternet);
      setFetchingProductsCategory(false);
    }
    if (modalState) {
      init();
    }
  }, [modalState]);

  const handleShopInfo = (name: string, value: string | number): void => {
    setShopInfo((oldValues) => ({ ...oldValues, [name]: value }));
  };

  return (
    <Container
      title={type === "entrada" ? "Entrada" : "Saída"}
      visible={modalState}
      destroyOnClose={true}
      closable={false}
      centered
      footer={
        <Footer>
          <ButtonCancel onClick={() => handleClose()}>Cancelar</ButtonCancel>
          <ButtonSave onClick={() => handleSubmit()}>
            Salvar alteração
          </ButtonSave>
        </Footer>
      }
    >
      <Form layout="vertical" initialValues={{ remember: false }}>
        <Content>
          <Row>
            <Col sm={24}>
              <Form.Item
                label="Motivo"
                name="reason"
                rules={[
                  {
                    required: true,
                    message: "Motivo é obrigatório",
                  },
                ]}
              >
                <Select onChange={handleSelect} placeholder="Escolha a opção">
                  {type === "entrada"
                    ? inValue.map((item) => (
                        <Option key={item.id}>{item.value}</Option>
                      ))
                    : outValue.map((item) => (
                        <Option key={item.id}>{item.value}</Option>
                      ))}
                </Select>
              </Form.Item>
            </Col>

            <Col sm={24}>
              <Form.Item
                label="Valor"
                name="value"
                rules={[
                  {
                    required: true,
                    message: "Valor é obrigatório",
                  },
                ]}
              >
                {type !== "entrada" &&
                hasInternet &&
                (reasontype === ReasonOutValue.PAG_FORNECEDOR ||
                  reasontype === ReasonOutValue.PAG_FREELA) ? (
                  <Input
                    value={currencyFormater(
                      (shopInfo?.unitary_value || 0) * (shopInfo?.quantity || 0)
                    )}
                    disabled
                  />
                ) : (
                  <MonetaryInput
                    autoFocus={false}
                    getValue={getAmount}
                    onEnterPress={handleSubmit}
                  />
                )}
              </Form.Item>
            </Col>

            {reasontype === "Outros" && (
              <Col sm={24}>
                <Form.Item
                  label="Observação"
                  name="observation"
                  rules={[
                    {
                      required: false,
                      message: "Observação é obrigatório",
                    },
                  ]}
                >
                  <Input.TextArea
                    placeholder="Digite alguma obsevação"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    showCount
                    maxLength={140}
                    value={reasson}
                    onPressEnter={handleSubmit}
                    onChange={({ target: { value } }) => setReasson(value)}
                  />
                </Form.Item>
              </Col>
            )}

            {type !== "entrada" && (
              <>
                {reasontype === ReasonOutValue.PAG_FORNECEDOR && hasInternet && (
                  <>
                    <Col sm={24}>
                      <Form.Item
                        label="Categoria"
                        name="category_id"
                        rules={[
                          {
                            required: true,
                            message: "Categoria é obrigatório",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Escolha a opção"
                          loading={fetchingProductsCategory}
                          onChange={(value) =>
                            handleShopInfo("category_id", +value)
                          }
                        >
                          {productsCategory?.map((productCategory) => (
                            <Option
                              value={productCategory.id}
                              key={productCategory.id}
                            >
                              {productCategory.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col sm={24}>
                      <Form.Item
                        label="Produto"
                        name="product_id"
                        rules={[
                          {
                            required: true,
                            message: "Produto é obrigatório",
                          },
                        ]}
                      >
                        <Select
                          placeholder="Escolha a opção"
                          disabled={!shopInfo?.category_id}
                          onChange={(value) =>
                            handleShopInfo("product_id", +value)
                          }
                        >
                          {productsCategory?.map(
                            (productCategory) =>
                              productCategory.id === shopInfo?.category_id &&
                              productCategory.products.map((product) => (
                                <Option value={product.id} key={product.id}>
                                  {product.name}
                                </Option>
                              ))
                          )}
                        </Select>
                      </Form.Item>
                    </Col>
                  </>
                )}

                {reasontype === ReasonOutValue.PAG_FREELA && hasInternet && (
                  <Col sm={24}>
                    <Form.Item
                      label="Nome Freelancer"
                      name="observation"
                      rules={[
                        {
                          required: true,
                          message: "Categoria é obrigatório",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Nome Freelancer"
                        onChange={({ target: { value } }) =>
                          handleShopInfo("observation", value)
                        }
                      />
                    </Form.Item>
                  </Col>
                )}

                {(reasontype === ReasonOutValue.PAG_FORNECEDOR ||
                  reasontype === ReasonOutValue.PAG_FREELA) &&
                  hasInternet && (
                    <>
                      <Col sm={12}>
                        <Form.Item
                          label="Quantidade"
                          name="quantity"
                          rules={[
                            {
                              required: true,
                              message: "Quantidade é obrigatório",
                            },
                          ]}
                        >
                          <Input
                            placeholder="Quantidade"
                            type="number"
                            onChange={({ target: { value } }) =>
                              handleShopInfo("quantity", value)
                            }
                          />
                        </Form.Item>
                      </Col>

                      <Col sm={12}>
                        <Form.Item
                          label="Valor Unitário"
                          name="unitary_value"
                          rules={[
                            {
                              required: true,
                              message: "Campo é obrigatório",
                            },
                          ]}
                        >
                          <MonetaryInput
                            autoFocus={false}
                            getValue={(value) =>
                              handleShopInfo("unitary_value", value)
                            }
                          />
                        </Form.Item>
                      </Col>

                      <Col sm={24}>
                        <Form.Item
                          label="Observação"
                          name="observation"
                          rules={[
                            {
                              required: false,
                              message: "Observação é obrigatório",
                            },
                          ]}
                        >
                          <Input.TextArea
                            placeholder="Digite alguma obsevação"
                            autoSize={{ minRows: 3, maxRows: 5 }}
                            showCount
                            maxLength={140}
                            onChange={({ target: { value } }) =>
                              handleShopInfo("observation", value)
                            }
                          />
                        </Form.Item>
                      </Col>
                    </>
                  )}

                {(reasontype === "Pagamento fornecedor" ||
                  reasontype === "Pagamento freelance") &&
                  !hasInternet && (
                    <Row style={{ textAlign: "center", color: "red" }}>
                      📢 Sem conexão! Utilize o Dashboard para lançar a saída
                      como compra.
                    </Row>
                  )}
              </>
            )}
          </Row>
        </Content>
      </Form>
    </Container>
  );
};

export default InOutForm;