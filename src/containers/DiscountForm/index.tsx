import React, { useState } from "react";
import { useSale } from "../../hooks/useSale";

import { message } from "antd";

import { Container, Input, Footer, ButtonCancel, ButtonSave } from "./styles";

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

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
    }
  };

  return (
    <Container
      title="Desconto"
      visible={discountModalState}
      onOk={handleSubmit}
      closable={true}
      onCancel={() => {
        // document.getElementById("mainContainer").focus();
        discountModalHandler.closeDiscoundModal();
      }}
      destroyOnClose={true}
      centered
      width={400}
      footer={
        <Footer>
          <ButtonCancel>Cancelar</ButtonCancel>
          <ButtonSave>Aplicar desconto</ButtonSave>
        </Footer>
      }
    >
      <Input
        //autoFocus={true}
        getValue={getAmount}
        onEnterPress={handleSubmit}
      />
    </Container>
  );
};

export default DiscountForm;
