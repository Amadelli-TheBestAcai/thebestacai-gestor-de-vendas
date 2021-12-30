import React, { useState, Dispatch, SetStateAction } from "react";

import { message } from "antd";

import { Container, Input } from "./styles";

interface IProps {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  onFinish: (value: number) => void;
}
const DiscountForm: React.FC<IProps> = ({
  modalState,
  setModalState,
  onFinish,
}) => {
  const [value, setValue] = useState<number>();

  const handleSubmit = () => {
    if (value < 0) {
      return message.warning("Informe um valor válido");
    }
    setModalState(false);
    setValue(0);
    onFinish(value);
    document.getElementById("mainContainer").focus();
  };

  const getAmount = (amount: number): void => {
    setValue(amount);
  };

  return (
    <Container
      title="Desconto"
      visible={modalState}
      onOk={handleSubmit}
      closable={false}
      onCancel={() => {
        document.getElementById("mainContainer").focus();
        setModalState(false);
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
