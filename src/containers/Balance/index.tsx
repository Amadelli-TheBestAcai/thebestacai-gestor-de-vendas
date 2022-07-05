import React, { useState, useEffect } from "react";

import Spinner from "../../components/Spinner";
import { Modal, notification, Spin } from "antd";
import { ProductDto } from "../../models/dtos/product";

import {
  Container,
  RightSide,
  LefttSide,
  InputPrice,
  InfoWeight,
} from "./styles";
import { PaymentType } from "../../models/enums/paymentType";

import { useSale } from "../../hooks/useSale";
interface IProps {
  openDiscoundModal: () => void;
  handleOpenPayment: (type: number, title: string) => void;
}

const BalanceContainer: React.FC<IProps> = ({
  handleOpenPayment,
  openDiscoundModal,
}) => {
  const { onAddItem, onRegisterSale } = useSale();
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
      const { response: products, has_internal_error: errorOnProducts } =
        await window.Main.product.getProducts(true);

      if (errorOnProducts) {
        notification.error({
          message: "Erro ao encontrar todos produtos",
          duration: 5,
        });
      }

      const _selfService = products?.find(
        (_product) => _product.product.category_id === 1
      );

      if (!_selfService) {
        notification.warning({
          message: "Self-service não foi cadastrado nessa loja",
          duration: 5,
        });
      }

      const { response: _settings, has_internal_error: errorOnSettings } =
        await window.Main.settings.getSettings();
      if (errorOnSettings) {
        notification.error({
          message: "Erro ao encontrar configurações",
          duration: 5,
        });
      }

      setShouldUseBalance(_settings.should_use_balance);
      setselfService(_selfService);
      setLoading(false);
    }
    init();
  }, []);

  const getQuantity = (): number => {
    if (!balanceAmount) {
      return 0;
    }
    return +(+balanceAmount / +(selfService?.price_unit || 0)).toFixed(4);
  };

  const handleEnterToSubmit = () => {
    if (!balanceAmount) {
      return;
    }
    document.getElementById("mainContainer").focus();
    onAddItem(selfService, getQuantity(), balanceAmount);
    setBalanceAmount(undefined);
  };

  const getWeightByBalance = async (): Promise<void> => {
    if (!fetchingBalanceWeight) {
      setFetchingBalanceWeight(true);
      window.Main.send("balance:get", ({ weight, error }) => {
        setFetchingBalanceWeight(false);
        if (error) {
          Modal.info({
            title: "Falha de Leitura",
            content:
              "Erro ao obter dados da balança. Reconecte o cabo de dados na balança e no computador, feche o APP, reinicie a balança e abra o APP novamente",
          });
        } else {
          const amount = +weight * +selfService?.price_unit;
          setBalanceAmount(amount);
        }
      });
    }
  };

  const handlerEventKey = async (key: string): Promise<void> => {
    const lowerKey = key.toLowerCase();
    if (lowerKey === "a") {
      handleOpenPayment(PaymentType.DINHEIRO, "Dinheiro");
    }
    if (lowerKey === "s") {
      handleOpenPayment(PaymentType.CREDITO, "C. Crédito");
    }
    if (lowerKey === "d") {
      handleOpenPayment(PaymentType.DEBITO, "C. Débito");
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
      onRegisterSale();
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
          <RightSide>
            <span>
              Preço indicado na balança
              {fetchingBalanceWeight && <Spin size="small" />}
            </span>
            {shouldUseBalance ? (
              <input
                id="balanceInput"
                value={balanceAmount?.toFixed(2).replace(".", ",") || "0,00"}
                autoFocus={true}
                onKeyPress={async (event) => await handlerEventKey(event.key)}
                readOnly
              />
            ) : (
              <InputPrice
                autoFocus={true}
                id="balanceInput"
                getValue={(value) => setBalanceAmount(value)}
                onEnterPress={handleEnterToSubmit}
                onPressKey={handlerEventKey}
              />
            )}
          </RightSide>
          <LefttSide>
            <span>Peso</span>

            <InfoWeight>
              KG{" "}
              {+balanceAmount
                ? (balanceAmount / +selfService?.price_unit)
                    ?.toFixed(4)
                    .replace(".", ",")
                : "0,0000"}
            </InfoWeight>
            <span>Preço do KG</span>
            <InfoWeight>
              R$ {(+selfService?.price_unit)?.toFixed(2).replace(".", ",")}
            </InfoWeight>
          </LefttSide>
        </Container>
      )}
    </>
  );
};

export default BalanceContainer;
