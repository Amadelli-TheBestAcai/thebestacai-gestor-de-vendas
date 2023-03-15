import React, { useState } from "react";
import { useSale } from "../../hooks/useSale";

import { message } from "antd";

import {
  Container,
  InputMask,
  Footer,
  ButtonCancel,
  ButtonSave,
  Select,
  Option,
  Input,
} from "./styles";

const DiscountForm: React.FC = () => {
  const { discountModalState, onAddDiscount, discountModalHandler, sale } =
    useSale();
  const [value, setValue] = useState<number>();
  const [discountType, setDiscountType] = useState(1);

  const handleSubmit = () => {
    if (!sale.payments.length) {
      return message.warning("A venda não possui nenhum pagamento");
    }
    if (value < 0 || (discountType === 2 && value > 100)) {
      return message.warning("Informe um valor válido");
    }
    discountModalHandler.closeDiscoundModal();
    setValue(0);
    setDiscountType(1);
    onAddDiscount(value);
    document.getElementById("mainContainer").focus();
  };

  const getAmount = (amount: number): void => {
    if (discountType === 2) {
      setValue(sale.total_sold * (amount / 100));
    } else {
      setValue(amount);
    }
  };

  const handleSelect = (type: number) => {
    setValue(0);
    setDiscountType(type);
  };

  const discountTypes = [
    {
      id: 1,
      value: "Unitário",
    },
    {
      id: 2,
      value: "Percentual",
    },
  ];

  return (
    <Container
      title="Desconto"
      visible={discountModalState}
      onOk={handleSubmit}
      closable={true}
      onCancel={() => {
        document.getElementById("mainContainer").focus();
        discountModalHandler.closeDiscoundModal();
      }}
      destroyOnClose={true}
      centered
      width={400}
      footer={
        <Footer>
          <ButtonCancel
            onClick={() => discountModalHandler.closeDiscoundModal()}
          >
            Cancelar
          </ButtonCancel>
          <ButtonSave onClick={() => handleSubmit()}>
            Aplicar desconto
          </ButtonSave>
        </Footer>
      }
    >
      <>
        <Select
          onChange={(type) => handleSelect(+type)}
          placeholder="Escolha a opção"
          defaultValue={"Unitário"}
        >
          {discountTypes.map((item) => (
            <Option key={item.id}>{item.value}</Option>
          ))}
        </Select>
      </>
      {discountType === 1 ? (
        <>
          <InputMask
            autoFocus={true}
            getValue={getAmount}
            onEnterPress={handleSubmit}
          />
        </>
      ) : (
        <>
          <Input
            autoFocus={true}
            placeholder="percentual (%)"
            onPressEnter={handleSubmit}
            onChange={({ target: { value } }) => getAmount(+value)}
            type="number"
          />
        </>
      )}
    </Container>
  );
};

export default DiscountForm;
