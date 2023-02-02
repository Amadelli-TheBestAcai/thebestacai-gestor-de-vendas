import React, { useEffect, useState } from "react";

import { Container, Row, Col, InputCode, Button } from "./styles";
import { notification } from "antd";

import { useSale } from "../../hooks/useSale";

const CupomModal: React.FC = () => {
  const { sale, updateSale, cupomModalState, setCupomModalState } = useSale();
  const [cupom, seCupom] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cupomModalState) {
      const saleHashCode = sale?.customerVoucher?.hash_code;
      if (saleHashCode) {
        seCupom([
          `${saleHashCode[0]}${saleHashCode[1]}`,
          `${saleHashCode[2]}${saleHashCode[3]}`,
          `${saleHashCode[4]}${saleHashCode[5]}`,
          `${saleHashCode[6]}${saleHashCode[7]}`,
        ]);
      }
    } else {
      seCupom(["", "", "", ""]);
    }
  }, [cupomModalState, sale]);

  const handleCupomState = (position: number, value: string): void => {
    const updatedValue = cupom;
    updatedValue[position] = value;
    seCupom(updatedValue);
  };

  const onFinish = async (): Promise<void> => {
    try {
      setLoading(true);
      const { has_internal_error, response, error_message } =
        await window.Main.sale.getVoucher(cupom.join(""));

      if (has_internal_error) {
        return notification.error({
          message: error_message || "Erro ao obter voucher",
          duration: 5,
        });
      }

      const newTotal = sale.items.reduce((total, item) => {
        const cupomItem = response.voucher.products.find(
          (voucherProduct) => voucherProduct.product_id === item.product.id
        );

        if (cupomItem) {
          return +cupomItem.price_sell * item.quantity + total;
        } else {
          return item.total + total;
        }
      }, 0);

      const { error } = await updateSale({
        customerVoucher: response,
        total_sold: newTotal,
      });

      if (error) {
        return notification.error({
          message: error,
          duration: 5,
        });
      }

      notification.success({
        message: "Cupom aplicado com sucesso",
        duration: 5,
      });

      setCupomModalState(false);
    } catch (e) {
      console.log(e);
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

      const { error } = await updateSale({
        customerVoucher: null,
        total_sold: newTotal,
      });

      if (error) {
        return notification.error({
          message: error,
          duration: 5,
        });
      }

      notification.success({
        message: "Cupom removido com sucesso",
        duration: 5,
      });

      setCupomModalState(false);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      visible={cupomModalState}
      onCancel={() => setCupomModalState(false)}
      footer={null}
      centered={true}
      width={400}
      destroyOnClose
    >
      <h2>Resgate de cupom</h2>
      <p>Digite o código do cupom abaixo para que o cupom seja resgatado.</p>

      <Row>
        <Col sm={4} xs={4}>
          <InputCode
            defaultValue={cupom[0]}
            maxLength={2}
            onChange={({ target: { value } }) => handleCupomState(0, value)}
          />
        </Col>
        <Col sm={4} xs={4}>
          <InputCode
            defaultValue={cupom[1]}
            maxLength={2}
            onChange={({ target: { value } }) => handleCupomState(1, value)}
          />
        </Col>
        <Col sm={4} xs={4}>
          <InputCode
            defaultValue={cupom[2]}
            maxLength={2}
            onChange={({ target: { value } }) => handleCupomState(2, value)}
          />
        </Col>
        <Col sm={4} xs={4}>
          <InputCode
            defaultValue={cupom[3]}
            maxLength={2}
            onChange={({ target: { value } }) => handleCupomState(3, value)}
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
      <br />
      <span>Remova os pagamentos</span>
      {sale.customerVoucher ? (
        <Button
          htmlType="submit"
          type="primary"
          loading={loading}
          onClick={onCancel}
        >
          Cancelar
        </Button>
      ) : (
        <Button
          htmlType="submit"
          type="primary"
          loading={loading}
          onClick={onFinish}
          disabled={!!sale.payments.length}
        >
          Resgatar
        </Button>
      )}
    </Container>
  );
};

export default CupomModal;
