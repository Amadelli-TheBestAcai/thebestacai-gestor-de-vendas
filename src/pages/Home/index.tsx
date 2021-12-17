import React, { useEffect, useState } from "react";

import Products from "../../containers/Products";
import Balance from "../../containers/Balance";
import Items from "../../containers/Items";
import Payments from "../../containers/Payments";
import Actions from "../../containers/Actions";

import Spinner from "../../components/Spinner";
import Register from "../../components/Register";
import CashNotFound from "../../components/CashNotFound";

import { ProductDto } from "../../models/dtos/product";
import { SaleDto } from "../../models/dtos/sale";
import { StoreCashDto } from "../../models/dtos/storeCash";

import { message } from "antd";
import {
  Container,
  Content,
  RightSide,
  LeftSide,
  BalanceContainer,
  ProductsContainer,
  ItemsContainer,
  PaymentsContainer,
  PaymentsTypesContainer,
  FinishContainer,
  ActionsContainer,
} from "./styles";

const Home: React.FC = () => {
  const [sale, setSale] = useState<SaleDto>();
  const [loading, setLoading] = useState(true);
  const [currentPayment, setCurrentPayment] = useState(0);
  const [paymentType, setPaymentType] = useState(0);
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentModalTitle, setPaymentModalTitle] = useState("");
  const [savingSale, setSavingSale] = useState(false);
  const [discountState, setDiscountState] = useState(false);
  const [storeCash, setStoreCash] = useState<StoreCashDto | null>(null);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const _sale = await window.Main.sale.getCurrent();
      const _storeCash = await window.Main.storeCash.getCurrent();
      setStoreCash(_storeCash);
      setSale(_sale);
      setLoading(false);
    }
    init();
  }, []);

  const addSaleItem = async (
    product: ProductDto,
    quantity: number
  ): Promise<void> => {
    const updatedSale = await window.Main.sale.addItem(product, quantity);
    setSale(updatedSale);
  };

  const decressSaleItem = async (id: string): Promise<void> => {
    const updatedSale = await window.Main.sale.decressItem(id);
    setSale(updatedSale);
  };

  const addPayment = async () => {
    if (!currentPayment) {
      return message.warning("Pagamento inválido");
    }
    const updatedSale = await window.Main.sale.addPayment(
      currentPayment,
      paymentType
    );
    setSale(updatedSale);

    setCurrentPayment(0);
    setPaymentModal(false);
  };

  const removePayment = async (id: string) => {
    const updatedSale = await window.Main.sale.deletePayment(id);
    setSale(updatedSale);
  };

  const handleOpenPayment = (type: number, title: string): void => {
    setPaymentType(type);
    setPaymentModal(true);
    setPaymentModalTitle(title);
  };

  const registerSale = async () => {
    if (savingSale) {
      return;
    }

    if (!sale.items.length) {
      return message.warning("Nenhum item cadastrado para a venda");
    }

    if (
      +(sale.total_sold.toFixed(2) || 0) >
      sale.total_paid + (sale.discount || 0) + 0.5
    ) {
      return message.warning("Pagamento inválido");
    }

    setSavingSale(true);
    const _newSale = await window.Main.sale.finishSale();
    setSale(_newSale);
    setSavingSale(false);
  };

  const addToQueue = (name: string): void => {
    console.log(name);
  };

  const addDiscount = (value: number): void => {
    if (value > sale.total_sold) {
      message.warning("Desconto maior que o valor da venda.");
      return;
    }
    setSale((oldValues) => ({ ...oldValues, discount: value }));
  };

  return (
    <Container id="mainContainer" allowChanges={true}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {!storeCash?.is_opened ? (
            <CashNotFound />
          ) : (
            <>
              <LeftSide>
                <BalanceContainer>
                  <Balance />
                </BalanceContainer>
                <ProductsContainer>
                  <Products addProduct={addSaleItem} />
                </ProductsContainer>
              </LeftSide>
              <RightSide>
                <Content>
                  <ActionsContainer>
                    <Actions
                      haveItensOnSale={!!sale.items.length}
                      addToQueue={addToQueue}
                      addDiscount={addDiscount}
                      discountState={discountState}
                      setDiscountState={setDiscountState}
                    />
                  </ActionsContainer>
                  <ItemsContainer>
                    <Items sale={sale} handleItem={decressSaleItem} />
                  </ItemsContainer>
                  <PaymentsContainer>
                    <PaymentsTypesContainer>
                      <Payments
                        sale={sale}
                        addPayment={addPayment}
                        removePayment={removePayment}
                        setCurrentPayment={setCurrentPayment}
                        modalState={paymentModal}
                        modalTitle={paymentModalTitle}
                        setModalState={setPaymentModal}
                        handleOpenPayment={handleOpenPayment}
                      />
                    </PaymentsTypesContainer>
                    <FinishContainer>
                      <Register
                        isSavingSale={savingSale}
                        registerSale={registerSale}
                        total={sale.total_sold}
                      />
                    </FinishContainer>
                  </PaymentsContainer>
                </Content>
              </RightSide>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default Home;
