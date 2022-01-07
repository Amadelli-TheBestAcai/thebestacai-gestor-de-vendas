import React, { useState, Dispatch, SetStateAction } from "react";

import { message } from "antd";

import { Container, Input } from "./styles";

interface IProps {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
  placeHolder: string;
  onFinish: (name: string) => void;
}

const InputForm: React.FC<IProps> = ({
  onFinish,
  placeHolder,
  modalState,
  setModalState,
}) => {
  const [name, setName] = useState<string>();
  const handleSubmit = () => {
    if (!name) {
      return message.warning("Preencha o campo");
    }
    setModalState(false);
    onFinish(name);
  };
  return (
    <Container
      visible={modalState}
      onOk={handleSubmit}
      closable={false}
      onCancel={() => setModalState(false)}
      width={300}
      destroyOnClose={true}
    >
      {/* <Input
        placeholder={placeHolder}
        autoFocus={true}
        value={name}
        onPressEnter={handleSubmit}
        onChange={({ target: { value } }) => setName(value)}
      /> */}
    </Container>
  );
};

export default InputForm;
