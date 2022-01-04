import React, { useState } from "react";

import { message } from "antd";

import { Container, Input } from "./styles";
import { useSale } from "../../hooks/useSale";

const DiscountForm: React.FC = () => {
  const { discountModalState, onAddDiscount, discountModalHandler } = useSale();
  const [value, setValue] = useState<number>();

  const handleSubmit = () => {
    if (value < 0) {
      return message.warning("Informe um valor válido");
    }
    discountModalHandler.closeDiscoundModal();
    setValue(0);
    onAddDiscount(value);
    document.getElementById("mainContainer").focus();
  };

  const getAmount = (amount: number): void => {
    setValue(amount);
  };

  return (
    <Container
      title="Desconto"
      visible={discountModalState}
      onOk={handleSubmit}
      closable={false}
      onCancel={() => {
        document.getElementById("mainContainer").focus();
        discountModalHandler.closeDiscoundModal();
      }}
      width={300}
      destroyOnClose={true}
    >
      <Input
        autoFocus={true}
        getValue={getAmount}
        onEnterPress={handleSubmit}
      />
    </Container>
  );
};

export default DiscountForm;
