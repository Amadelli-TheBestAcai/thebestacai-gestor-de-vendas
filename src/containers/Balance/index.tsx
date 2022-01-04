import React, { useState, useEffect } from "react";

import Spinner from "../../components/Spinner";
import { Modal } from "antd";
import { ProductDto } from "../../models/dtos/product";

import {
  Container,
  TopContainer,
  BottomContainer,
  Price,
  Weight,
  PriceContainer,
  Text,
  WeightContainer,
  InputPrice,
} from "./styles";
import { PaymentType } from "../../models/enums/paymentType";

interface IProps {
  openDiscoundModal: () => void;
  handleOpenPayment: (type: number, title: string) => void;
  addItem: (product: ProductDto, quantity?: number, total?: number) => void;
}

const BalanceContainer: React.FC<IProps> = ({
  handleOpenPayment,
  openDiscoundModal,
}) => {
  const [selfService, setselfService] = useState<ProductDto | undefined>(
    undefined
  );
  const [shouldUseBalance, setShouldUseBalance] = useState(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchingBalanceWeight, setFetchingBalanceWeight] =
    useState<boolean>(false);
  const [balanceAmount, setBalanceAmount] = useState<number>();
  useEffect(() => {
    async function init() {
      setLoading(true);
      const selfService = await window.Main.product.getSelfService();
      setselfService(selfService);
      setLoading(false);
    }
    init();
  }, []);

  const getQuantity = (): number => {
    if (!balanceAmount) {
      return 0;
    }
    return +(+balanceAmount / +selfService.price_unit).toFixed(4);
  };

  const handleEnterToSubmit = () => {
    if (!balanceAmount) {
      return;
    }
    document.getElementById("mainContainer").focus();
    //addItem(selfService, getQuantity(), balanceAmount);
    setBalanceAmount(undefined);
  };

  const getWeightByBalance = async (): Promise<void> => {
    if (!fetchingBalanceWeight) {
      setFetchingBalanceWeight(true);
      // TODO: INTEGRAR BALANÇA
      const response = { weight: 1, error: null };
      const { weight, error } = response;
      setFetchingBalanceWeight(false);
      if (error) {
        Modal.info({
          title: "Falha de Leitura",
          content:
            "Erro ao obter dados da balança. Reconecte o cabo de dados na balança e no computador, feche o APP, reinicie a balança e abra o APP novamente",
        });
      } else {
        const amount = +weight * +selfService.price_unit;
        setBalanceAmount(amount);
      }
    }
  };

  const handlerEventKey = async (key: string): Promise<void> => {
    const lowerKey = key.toLowerCase();
    if (lowerKey === "a") {
      handleOpenPayment(PaymentType.DINHEIRO, "Dinheiro");
    }
    if (lowerKey === "s") {
      handleOpenPayment(PaymentType.CREDITO, "Crédito");
    }
    if (lowerKey === "d") {
      handleOpenPayment(PaymentType.DEBITO, "Débito");
    }
    if (lowerKey === "t") {
      handleOpenPayment(PaymentType.TICKET, "Ticket");
    }
    if (lowerKey === "p") {
      handleOpenPayment(PaymentType.PIX, "PIX");
    }
    if (shouldUseBalance && key === "Enter") {
      handleEnterToSubmit();
    }
    if (lowerKey === "f1") {
      // registerSale();
    }
    if (lowerKey === "r") {
      openDiscoundModal();
    }
    if (shouldUseBalance && lowerKey === "b") {
      await getWeightByBalance();
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Container>
          <TopContainer>
            <Text>Preço indicado na balança</Text>

            <InputPrice
              autoFocus={true}
              id="balanceInput"
              getValue={(value: number) => console.log(value)}
            />
          </TopContainer>
          <BottomContainer>
            <PriceContainer>
              <Text>Preço do KG</Text>
              <Price>
                R$ {(+selfService?.price_unit)?.toFixed(2).replace(".", ",")}
              </Price>
            </PriceContainer>
            <WeightContainer>
              <Text>Peso</Text>
              <Weight>
                KG {(+selfService.price_unit)?.toFixed(4).replace(".", ",")}
              </Weight>
            </WeightContainer>
          </BottomContainer>
        </Container>
      )}
    </>
  );
};

export default BalanceContainer;
