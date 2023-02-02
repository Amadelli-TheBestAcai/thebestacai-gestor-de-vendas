import React, { useEffect, useState } from "react";

import { Container, Row, Col, InputCode, Button } from "./styles";
import { notification } from "antd";

import { useSale } from "../../hooks/useSale";

const CupomModal: React.FC = () => {
  const { sale, setSale, cupomModalState, setCupomModalState } = useSale();
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
          message: error_message || "Erro ao criar movimentação",
          duration: 5,
        });
      }

      setSale((oldValues) => ({
        ...oldValues,
        customerVoucher: response,
      }));

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

  const onCancel = (): void => {
    setSale((oldValues) => ({
      ...oldValues,
      customerVoucher: null,
    }));

    notification.success({
      message: "Cupom removido com sucesso",
      duration: 5,
    });

    setCupomModalState(false);
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
        >
          Resgatar
        </Button>
      )}
    </Container>
  );
};

export default CupomModal;
