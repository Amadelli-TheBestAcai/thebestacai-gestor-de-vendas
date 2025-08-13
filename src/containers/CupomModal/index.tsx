import React, { useEffect, useState, Dispatch, SetStateAction } from "react";

import { notification } from "antd";
import { useSale } from "../../hooks/useSale";
import { Container, Row, Col, InputCode, Button } from "./styles";

interface ICupomProps {
  cupomModalState: boolean;
  setCupomModalState: Dispatch<SetStateAction<boolean>>;
}

const CupomModal: React.FC<ICupomProps> = ({
  cupomModalState,
  setCupomModalState,
}) => {
  const { sale, setSale } = useSale();
  const [cupom, setCupom] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cupomModalState) {
      const saleHashCode = sale?.customerVoucher?.hash_code;
      if (saleHashCode) {
        setCupom([
          `${saleHashCode[0]}${saleHashCode[1]}`,
          `${saleHashCode[2]}${saleHashCode[3]}`,
          `${saleHashCode[4]}${saleHashCode[5]}`,
          `${saleHashCode[6]}${saleHashCode[7]}`,
        ]);
      }
    } else {
      setCupom(["", "", "", ""]);
    }
  }, [cupomModalState, sale]);

  useEffect(() => {
    if (!cupomModalState) {
      setLoading(false);
      document.getElementById("balanceInput")?.focus();
    }
  }, [cupomModalState]);

  const handleCupomState = (
    position: number,
    value: string,
    name: string
  ): void => {
    const updatedValue = cupom;
    updatedValue[position] = value;
    setCupom(updatedValue);
    const input = document.getElementsByName(name)[0];
    //@ts-ignore
    if (input.value.toString().length === 2) {
      const nextInputName = +name + 1 === 5 ? 4 : +name + 1;
      const nextInput = document.getElementsByName(nextInputName.toString())[0];
      nextInput.focus();
    }
  };

  const handleKeyDown = (key: string, name: string) => {
    if (key === "Backspace") {
      const input = document.getElementsByName(name)[0];
      //@ts-ignore
      if (input.value.toString().length === 0) {
        const previousInputName = +name - 1 === 1 ? 1 : +name - 1;
        const previousInput = document.getElementsByName(
          previousInputName.toString()
        )[0];
        previousInput?.focus();
      }
    }
    if (key === "Enter") onFinish();
  };

  const onFinish = async (): Promise<void> => {
    if (cupom.some((value) => value.length != 2)) {
      return notification.warn({
        message:
          "É necessário preencher todos os campos corretamente para adicionar o cupom!",
        duration: 5,
      });
    }

    if (sale.items.length === 0) {
      return notification.warn({
        message:
          "É necessário adicionar pelo menos um item ao carrinho para usar um cupom.",
        duration: 5,
      });
    }

    try {
      setLoading(true);
      let { has_internal_error, response, error_message } =
        await window.Main.sale.getVoucher(cupom.join("").toUpperCase());

      if (has_internal_error) {
        return notification.error({
          message: error_message || "Erro ao obter voucher",
          duration: 5,
        });
      }

      const { response: products } = await window.Main.product.getProducts(
        true
      );
      delete response.voucher.companies;

      const totalSoldInSelfService = sale.items
        .filter((item) => item.product.id === 1)
        .reduce((total, item) => total + item.total, 0);

      if (response.voucher?.self_service && totalSoldInSelfService <= 0) {
        return notification.warn({
          message:
            "É necessário adicionar self-services para resgatar este cupom!",
          duration: 5,
        });
      }

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

      response.voucher.products = response.voucher.products.filter(
        (productVoucher) =>
          sale.items.some(
            (item) => item.product.id === productVoucher.product_id
          )
      );

      if (!response.voucher.products.length) {
        return notification.warn({
          message:
            "Os produtos vinculados a este cupom não estão presentes no carrinho.",
          duration: 5,
        });
      }

      let totalOfCupomProducs = 0;

      response.voucher.products.forEach((productVoucher) => {
        const product = products.find(
          (product) => product.product_id === productVoucher.product_id
        );
        const item = sale.items.find(
          (item) => item.product.id === productVoucher.product_id
        );

        if (product && item) {
          productVoucher.is_registred = true;
          productVoucher.in_sale = true;

          let discountAmount = 0;
          if (productVoucher.discount_type === 1) {
            const percent = +productVoucher.price_sell / 100;
            discountAmount = +product.price_unit * percent;
          } else {
            discountAmount = +productVoucher.price_sell;
          }

          totalOfCupomProducs += discountAmount;
        } else {
          productVoucher.is_registred = false;
          productVoucher.in_sale = false;
        }

        if (productVoucher.additional_value) {
          totalOfCupomProducs -= +productVoucher.additional_value;
        }
      });

      const totalDiscount = Math.abs(
        totalOfSelfServiceDiscount + totalOfCupomProducs
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
          message:
            errorOnUpdateSale || "Oops, ocorreu um erro ao atualizar a venda!",
          duration: 5,
        });
      }

      setSale(updatedSale);
      notification.success({
        message: "Cupom aplicado com sucesso",
        duration: 5,
      });
      setCupomModalState(false);
    } catch (e) {
      notification.error({ message: "Oops! Ocorreu um erro", duration: 5 });
    } finally {
      setLoading(false);
    }
  };

  const onCancel = async (): Promise<void> => {
    try {
      setLoading(true);
      const newTotal = sale.items.reduce(
        (total, item) => item.total + total,
        0
      );

      const payload = {
        ...sale,
        discount: 0,
        customerVoucher: null,
        total_sold: newTotal,
      };

      const { response: _sale, has_internal_error: errorOnUpdateSale } =
        await window.Main.sale.updateSale(sale.id, payload);

      if (errorOnUpdateSale) {
        return notification.error({
          message:
            errorOnUpdateSale || "Oops, ocorreu um erro ao resgatar o cupom!",
          duration: 5,
        });
      }

      setSale(_sale);

      notification.info({
        message: "Você cancelou a utilização do cupom!",
        description: "Ele ainda poderá ser utilizado",
        duration: 5,
      });

      setCupomModalState(false);
    } catch (e) {
      notification.error({
        message: "Oops, ocorreu um erro",
        duration: 5,
      });
    } finally {
      setLoading(false);
      setLoading(false);
    }
  };

  return (
    <Container
      visible={cupomModalState}
      onCancel={() => {
        setCupomModalState(false);
      }}
      footer={null}
      centered={true}
      width={400}
      destroyOnClose
      afterClose={() => document.getElementById("balanceInput")?.focus()}
    >
      {sale.customerVoucher ? (
        <>
          <h3> Para remover o cupom utilizado Clique no botão abaixo</h3>
          <br />
          <span>
            <strong>Obs:</strong>Caso a venda seja finalizada, não será possível
            desvincular o cupom desta venda
          </span>
          <Button
            htmlType="submit"
            type="primary"
            loading={loading}
            onClick={onCancel}
          >
            <span className="buttonSpan">Remover</span>
          </Button>
        </>
      ) : (
        <>
          <h2>Resgate de cupom</h2>
          <p>Digite abaixo o código do cupom para fazer o resgate.</p>

          <Row>
            <Col sm={5} xs={5}>
              <InputCode
                defaultValue={cupom[0]}
                maxLength={2}
                name="1"
                onChange={({ target: { value } }) =>
                  handleCupomState(0, value, "1")
                }
                onKeyDown={({ key }) => handleKeyDown(key, "1")}
                autoFocus
                tabIndex={1}
              />
            </Col>
            <Col sm={5} xs={5}>
              <InputCode
                defaultValue={cupom[1]}
                maxLength={2}
                name="2"
                onKeyDown={({ key }) => handleKeyDown(key, "2")}
                onChange={({ target: { value } }) =>
                  handleCupomState(1, value, "2")
                }
                tabIndex={2}
              />
            </Col>
            <Col sm={5} xs={5}>
              <InputCode
                defaultValue={cupom[2]}
                maxLength={2}
                name="3"
                onKeyDown={({ key }) => handleKeyDown(key, "3")}
                onChange={({ target: { value } }) =>
                  handleCupomState(2, value, "3")
                }
                tabIndex={3}
              />
            </Col>
            <Col sm={5} xs={5}>
              <InputCode
                defaultValue={cupom[3]}
                maxLength={2}
                name="4"
                onKeyDown={({ key }) => handleKeyDown(key, "4")}
                onChange={({ target: { value } }) =>
                  handleCupomState(3, value, "4")
                }
                tabIndex={4}
              />
            </Col>
          </Row>
          <span>
            <strong>Obs:</strong>O cupom deve ser aplicado antes de finalizar a
            venda
          </span>
          <br />
          <span>
            <strong>Para recalcular o valor total:</strong>
          </span>
          <span> Remova os pagamentos</span>
          <Button
            htmlType="submit"
            type="primary"
            loading={loading}
            onClick={onFinish}
          >
            <span className="buttonSpan">Resgatar</span>
          </Button>
        </>
      )}
    </Container>
  );
};

export default CupomModal;
