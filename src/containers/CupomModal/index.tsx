import React, { useEffect, useState } from "react";

import { Container, Row, Col, InputCode, Button } from "./styles";

import { useSale } from "../../hooks/useSale";

const CupomModal: React.FC = () => {
  const { cupomModalState, setCupomModalState } = useSale();
  const [cupom, seCupom] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cupomModalState) {
      seCupom(["", "", "", ""]);
    }
  }, [cupomModalState]);

  const handleCupomState = (position: number, value: string): void => {
    const updatedValue = cupom;
    updatedValue[position] = value;
    seCupom(updatedValue);
  };

  const onFinish = async (): Promise<void> => {
    try {
      setLoading(true);
      /*
        CHAMA O BACK AQUI
      */
      console.log(cupom.join(""));
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
            maxLength={2}
            onChange={({ target: { value } }) => handleCupomState(0, value)}
          />
        </Col>
        <Col sm={4} xs={4}>
          <InputCode
            maxLength={2}
            onChange={({ target: { value } }) => handleCupomState(1, value)}
          />
        </Col>
        <Col sm={4} xs={4}>
          <InputCode
            maxLength={2}
            onChange={({ target: { value } }) => handleCupomState(2, value)}
          />
        </Col>
        <Col sm={4} xs={4}>
          <InputCode
            maxLength={2}
            onChange={({ target: { value } }) => handleCupomState(3, value)}
          />
        </Col>
      </Row>

      <Button
        htmlType="submit"
        type="primary"
        loading={loading}
        onClick={onFinish}
      >
        Resgatar
      </Button>
    </Container>
  );
};

export default CupomModal;
