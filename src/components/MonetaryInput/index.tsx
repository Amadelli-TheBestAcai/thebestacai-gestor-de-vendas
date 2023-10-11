import React, { useState, useEffect } from "react";

import { Input } from "./styles";

type IProps = {
  getValue: (value: number) => void;
  onEnterPress?: () => void;
  onPressKey?: (key: string) => void;
  defaultValue?: number;
  id?: string;
  autoFocus?: boolean;
  readOnly?: boolean;
};

const currencyConfig = {
  locale: "pt-BR",
  formats: {
    number: {
      BRL: {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
  },
};

const MonetaryInput: React.FC<IProps> = ({
  getValue,
  onEnterPress,
  defaultValue,
  id,
  onPressKey,
  autoFocus,
  readOnly,
}) => {
  const [amount, setAmount] = useState<number>(defaultValue || 0);

  useEffect(() => {
    getValue(defaultValue || 0);
  }, []);

  const handleChange = (event, value) => {
    if (typeof value !== "number" && typeof value !== "string") {
      return;
    }
    event.preventDefault();
    setAmount(+value);
    getValue(+value);
  };

  const handleKeyPress = (event) => {
    if (onEnterPress && event.key === "Enter") {
      onEnterPress();
      setAmount(0);
    }
    if (onPressKey) {
      onPressKey(event.key);
    }
  };

  return (
    <Input
      id={id}
      value={amount}
      currency="BRL"
      autoFocus={autoFocus}
      className="ant-input"
      config={currencyConfig}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
      onClick={({ target }) => {
        target.selectionStart = 10000;
      }}
      readOnly={readOnly}
    />
  );
};

export default MonetaryInput;
