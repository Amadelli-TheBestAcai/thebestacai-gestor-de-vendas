import React, { Dispatch, SetStateAction, useState } from "react";

import cupom from "../../../../assets/totem/svg/cupom.svg";
import arrow_left from "../../../../assets/totem/svg/arrow_left.svg";

import { useSale } from "../../../../hooks/useSale";

import VirtualPinpad from "../VirtualPinpad";
import ModalInvalidCupom from "../ModalInvalidCupom";

import { CustomerVoucherDTO } from "../../../../../electron/src/models/dtos";

import { notification } from "antd";

import {
  Body,
  Button,
  ButtonFinalize,
  Container,
  Footer,
  Header,
  Input,
} from "./styles";

interface IProps {
  setStep: Dispatch<SetStateAction<number>>;
}
const Cupom: React.FC<IProps> = ({ setStep }) => {
  const { sale, setSale } = useSale();
  const [loading, setLoading] = useState<boolean>(false);
  const [cupomInput, setCupomInput] = useState<string>("");
  const [validCupom, setValidCupom] = useState<string>("Teste");
  const [customerVoucher, setCustomerVoucher] = useState<CustomerVoucherDTO>();
  const [errorMessage, setErrorMesssage] = useState<string>("");
  const [visibleInvalidCupom, setVisibleInvalidCupom] =
    useState<boolean>(false);
  const [stepCupomPage, setStepCupomPage] = useState<1 | 2>(1);

  const onAddCupom = async () => {
    if (cupomInput.length != 8) {
      return;
    }
    try {
      setLoading(true);
      let { has_internal_error, response, error_message } =
        await window.Main.sale.getVoucher(cupomInput.toUpperCase());

      if (has_internal_error) {
        setErrorMesssage(error_message);
        setVisibleInvalidCupom(true);
        return;
      }
      setCustomerVoucher(response);

      const { response: products } =
        await window.Main.product.getProductsByTags(["totem"]);

      delete response.voucher.companies;

      const totalSoldInSelfService = sale.items
        .filter((item) => item.product.id === 1)
        .reduce((total, item) => total + item.total, 0);

      if (response.voucher?.self_service && totalSoldInSelfService <= 0) {
        setErrorMesssage(
          "É necessário adicionar self-services para resgatar este cupom!",
        );
        setVisibleInvalidCupom(true);
        return;
      }

      const hasVoucherProduct = response.voucher.products.some(
        (voucherProduct) =>
          sale.items.some(
            (item) => item.product.id === voucherProduct.product_id,
          ),
      );

      if (!hasVoucherProduct) {
        setErrorMesssage(
          "Esse cupom não pode ser aplicado a nenhum item da sacola!",
        );
        setVisibleInvalidCupom(true);
        return;
      }

      response.voucher.products = response.voucher.products.filter(
        (voucherProduct) =>
          sale.items.some(
            (item) => item.product.id === voucherProduct.product_id,
          ),
      );

      let totalOfSelfServiceDiscount = 0;

      if (response.voucher.self_service) {
        if (response.voucher.self_service_discount_type === 1) {
          const percentOfDiscount =
            +response.voucher.self_service_discount_amount / 100;

          totalOfSelfServiceDiscount =
            totalSoldInSelfService * percentOfDiscount;

          response.voucher.products.push({
            product_id: 1,
            product_name: `Desconto de ${
              percentOfDiscount * 100
            }% em Self-service`,
            price_sell: totalOfSelfServiceDiscount.toFixed(2),
          });
        } else {
          const totalQuantity = sale.items
            .filter((item) => item.product.id === 1)
            .reduce((total, item) => total + item.quantity, 0);

          totalOfSelfServiceDiscount = +(
            +response.voucher.self_service_discount_amount * totalQuantity
          ).toFixed(2);

          totalOfSelfServiceDiscount -= totalSoldInSelfService;

          response.voucher.products.push({
            product_id: 1,
            product_name: `Desconto de ${+response.voucher
              .self_service_discount_amount}R$`,
            price_sell: Math.abs(totalOfSelfServiceDiscount).toString(),
          });
        }
      }

      let totalOfCupomProducts = 0;
      response.voucher.products.forEach((productVoucher, index) => {
        if (
          response.voucher.self_service &&
          productVoucher.product_id === 1 &&
          productVoucher.product_name?.includes("Desconto de") &&
          productVoucher.product_name?.includes("Self-service")
        ) {
          response.voucher.products[index].is_registred = true;
          response.voucher.products[index].in_sale = true;
          return;
        }

        const product = products.find(
          (product) => product.product_id === productVoucher.product_id,
        );

        const item = sale.items.find(
          (item) => item.product.id === productVoucher.product_id,
        );

        if (product && item) {
          response.voucher.products[index].is_registred = true;
          response.voucher.products[index].in_sale = true;

          let discountAmount = 0;

          if (productVoucher.discount_type === 1) {
            const percent = +productVoucher.price_sell / 100;

            discountAmount = +item.total * percent;
          } else {
            discountAmount = +productVoucher.price_sell;
          }

          totalOfCupomProducts += discountAmount;
        } else {
          response.voucher.products[index].is_registred = false;
          response.voucher.products[index].in_sale = false;
        }

        if (productVoucher.additional_value) {
          totalOfCupomProducts -= +productVoucher.additional_value;
        }
      });
      const totalDiscount = Math.abs(
        totalOfSelfServiceDiscount + totalOfCupomProducts,
      );

      const payload = {
        ...sale,
        customerVoucher: response,
        total_sold: sale.total_sold - totalDiscount,
      };

      const { response: updatedSale, has_internal_error: errorOnUpdateSale } =
        await window.Main.sale.updateSale(sale.id, payload);

      if (errorOnUpdateSale) {
        return notification.error({
          message: "Ops! Algo deu errado.",
          description: "Por favor informe o atendente",
          duration: 5,
          className: "notification-totem",
        });
      }

      setSale(updatedSale);
      setStepCupomPage(2);
    } catch (e) {
      notification.error({
        message: "Ops! Algo deu errado.",
        description: "Por favor informe o atendente",
        duration: 5,
        className: "notification-totem",
      });
    } finally {
      setLoading(false);
    }
  };

  const returnCheckOut = async () => {
    setStepCupomPage(1);
    setCupomInput("");
    setValidCupom("");
    setErrorMesssage("");
    setStep(4);
  };

  return (
    <Container>
      {stepCupomPage === 1 ? (
        <>
          <Header>
            <span>Inserir Cupom</span>
          </Header>
          <Body style={{ padding: "6rem 0 0" }}>
            <span className="span-cupom">INFORME O CÓDIGO DO CUPOM</span>
            <div className="inputContainer">
              <Input
                value={cupomInput}
                placeholder={"Código do cupom"}
                disabled
              />
            </div>
            <div className="div-pinpad">
              <VirtualPinpad
                value={cupomInput}
                setValue={setCupomInput}
                maxLenght={8}
              />
            </div>
          </Body>
          <Footer>
            <Button onClick={() => returnCheckOut()} disabled={loading}>
              <img src={arrow_left} />
              Voltar
            </Button>
            <ButtonFinalize
              onClick={() => {
                onAddCupom();
              }}
              step={stepCupomPage}
              disabled={cupomInput.length != 8 || loading}
            >
              Confirmar
            </ButtonFinalize>
          </Footer>
        </>
      ) : (
        <>
          <Header>
            <span>Cupom inserido com sucesso!</span>
          </Header>
          <Body style={{ padding: "6rem 0 0" }}>
            <span className="span-cupom-title">
              <img src={cupom} />
              {customerVoucher?.voucher?.name || "Cupom"}
            </span>
            {customerVoucher?.voucher?.url_image ? (
              <img
                src={customerVoucher?.voucher?.url_image}
                className="cupom-img"
              />
            ) : (
              <img src={cupom} className="cupom-icon" />
            )}
            <div className="cupom-description">
              {customerVoucher?.voucher?.description}
            </div>
          </Body>
          <Footer>
            <ButtonFinalize
              onClick={() => {
                returnCheckOut();
              }}
              step={stepCupomPage}
            >
              Confirmar
            </ButtonFinalize>
          </Footer>
        </>
      )}
      <ModalInvalidCupom
        text={errorMessage}
        visible={visibleInvalidCupom}
        setVisible={setVisibleInvalidCupom}
        returnCheckOut={returnCheckOut}
      />
    </Container>
  );
};

export default Cupom;
