import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Modal, Radio, notification } from "antd";
import { useCashHistoryId } from "../../hooks/useCashHistoryId";
import { Options } from "../../models/enums/weightOptions";

import {
  Form,
  ButtonCancel,
  ButtonSave,
  ColModal,
  ContentModalBody,
  Footer,
  Input,
} from "./styles";
import { ProductDto } from "../../models/dtos/product";
import { useStore } from "../../hooks/useStore";
import MonetaryInput from "../../components/MonetaryInput";

interface IProps {
  visible: boolean;
  loading: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  selectedProduct: ProductDto | null;
  setSelectedProduct: Dispatch<SetStateAction<ProductDto | null>>;
}

const options = [
  "Produto quebrado",
  "Montagem errada",
  "Consumo de franqueados",
  "Consumo de funcionário",
  "Devolução de cliente",
  "Consumo influencer",
  "Fruta passada",
  "Produto vencido",
  "Açai/sorvete cristalizado",
  "Cascas",
  "Bonificação de cliente (voucher)",
  "Outros",
];

const ModalAddWaste: React.FC<IProps> = ({
  setVisible,
  visible,
  setLoading,
  selectedProduct,
  setSelectedProduct,
}) => {
  const [image, setImage] = useState(null);
  const [value, setValue] = useState(Options.Quilograma);
  const [reasonOption, setReasonOption] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [unitSuffix, setUnitSuffix] = useState("kg");
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>();

  const [form] = Form.useForm();
  const { store } = useStore();
  const { cashHistoryId } = useCashHistoryId();

  useEffect(() => {
    if (!visible) {
      setSelectedProduct(null);
    } else {
      setPrice(+selectedProduct?.price_sell);
    }
  }, [visible]);

  useEffect(() => {
    if (value === Options.Quilograma) {
      setUnitSuffix("kg");
    } else if (value === Options.Unidade) {
      setUnitSuffix("un");
    }
  }, [value]);

  const handleSave = async () => {
    await form.validateFields();
    setLoading(true);
    try {
      const file = await getBase64(image);
      const payload = {
        cash_history_id: cashHistoryId.history_id,
        file,
        quantity: quantity,
        store_id: store.company_id,
        unity: value,
        product_store_id: selectedProduct.product_store_id,
        reason: reasonOption,
        price_sell: price,
      };

      await window.Main.productWaste.addWaste(payload);

      notification.success({
        message: "Desperdício cadastrado com sucesso",
        duration: 5,
      });
      form.resetFields();
      setLoading(false);
    } catch (error) {
      notification.error({
        message: "Oops, ocorreu um erro!",
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  function getBase64(file): Promise<any> {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function (error) {
        reject(error);
      };
    });
  }

  return (
    <Modal
      title="Adicionar desperdício"
      visible={visible}
      onCancel={() => {
        setVisible(false);
        form.resetFields();
      }}
      destroyOnClose={true}
      centered
      footer={
        <Footer>
          <ButtonCancel
            onClick={() => {
              form.resetFields();
              setVisible(false);
            }}
          >
            Cancelar
          </ButtonCancel>
          <ButtonSave onClick={handleSave} disabled={quantity <= 0}>
            Salvar
          </ButtonSave>
        </Footer>
      }
    >
      <Form layout="vertical" form={form}>
        <ContentModalBody gutter={24}>
          <ColModal sm={12}>
            <Form.Item
              label="Unidade de medida"
              name="unity"
              rules={[{ required: true, message: "Selecione uma unidade" }]}
            >
              <Radio.Group
                onChange={(e) => setValue(e.target.value)}
                value={value}
                style={{ alignItems: "center" }}
              >
                <Radio value={Options.Quilograma} checked>
                  Quilograma
                </Radio>
                <Radio
                  value={Options.Unidade}
                  disabled={selectedProduct?.category_id === 10}
                >
                  Unidade
                </Radio>
              </Radio.Group>
            </Form.Item>
          </ColModal>

          <ColModal sm={24}>
            <Form.Item
              label="Quantidade"
              name="quantity"
              rules={[
                { required: true, message: "Digite a quantidade" },
                {
                  validator: (_, value) =>
                    value > 0
                      ? Promise.resolve()
                      : Promise.reject(
                        new Error("A quantidade não pode ser negativa")
                      ),
                },
              ]}
            >
              <Input
                type="number"
                placeholder="Digite aqui"
                value={quantity}
                onChange={(e) => {
                  setQuantity(+e.target.value);
                }}
                addonAfter={unitSuffix}
              />
            </Form.Item>

            <Form.Item label="Valor do Produto" name="price">
              <MonetaryInput
                defaultValue={price}
                getValue={(e) => {
                  setPrice(e);
                }}
              />
            </Form.Item>
          </ColModal>
          <ColModal sm={24}>
            <Form.Item
              label="Upload de imagem"
              name="url_file"
              rules={[
                {
                  required: true,
                  message: "Por favor, faça o upload de uma imagem",
                },
              ]}
            >
              <input
                type="file"
                onChange={({ target: { files } }) => setImage(files[0])}
              />
            </Form.Item>
          </ColModal>
          <ColModal sm={24}>
            <Form.Item
              label="Selecione um motivo"
              name="reason"
              rules={[{ required: true, message: "Selecione um motivo" }]}
            >
              <Radio.Group
                onChange={(e) => {
                  setReasonOption(e.target.value);
                  setShowOtherInput(e.target.value === "Outros");
                  form.setFieldsValue({ reason: e.target.value });
                }}
                value={reasonOption}
              >
                {options.map((option, index) => (
                  <Radio key={index} value={option}>
                    {option}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </ColModal>

          {showOtherInput && (
            <ColModal sm={24}>
              <Form.Item label="Digite o motivo" name="motivo">
                <Input
                  autoFocus={true}
                  value={reasonOption}
                  onChange={({ target: { value } }) => setReasonOption(value)}
                />
              </Form.Item>
            </ColModal>
          )}
        </ContentModalBody>
      </Form>
    </Modal>
  );
};

export default ModalAddWaste;