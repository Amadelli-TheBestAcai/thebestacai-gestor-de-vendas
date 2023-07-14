import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Modal, Radio, notification } from "antd";
import { ProductDto } from "../../../models/dtos/product";
import { ProductWasteDTO } from "../../../models/dtos/productWaste";
import { Options } from "../../../models/enums/weightOptions";
import s3Api from "../../../helpers/s3Api";
import {
  Form,
  ButtonCancel,
  ButtonSave,
  ColModal,
  ContentModalBody,
  Footer,
  Input,
  SelectSearch,
  Option,
} from "./styles";
import { useStore } from "../../../hooks/useStore";
import { useCashHistoryId } from "../../../hooks/useCashHistoryId";

interface IProps {
  visible: boolean;
  loading: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  productsStore: ProductDto[];
  products: ProductWasteDTO[];
  setShouldSearch: Dispatch<SetStateAction<boolean>>;
}

const ModalAddWaste: React.FC<IProps> = ({
  setVisible,
  visible,
  setLoading,
  productsStore,
  setShouldSearch,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<
    ProductDto | undefined
  >(undefined);
  const [image, setImage] = useState(null);
  const [value, setValue] = useState(Options.Quilograma);
  const [unitSuffix, setUnitSuffix] = useState("kg");

  const [form] = Form.useForm();
  const { store } = useStore();
  const { cashHistoryId } = useCashHistoryId();

  useEffect(() => {
    if (value === Options.Quilograma) {
      setUnitSuffix("kg");
    } else if (value === Options.Unidade) {
      setUnitSuffix("un");
    }
  }, [value]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const values = form.getFieldsValue();
      if (!image) {
        notification.warning({
          message: "Por favor, faça o upload de uma imagem",
          duration: 5,
        });
        setLoading(false);
        return;
      }

      const s3_info = await handleUpload(image);
      const payload = {
        ...values,
        cash_history_id: cashHistoryId.history_id,
        store_id: store.company_id,
        s3_key: s3_info.s3_key,
        url_file: s3_info.url_file,
      };

      const response = await window.Main.productWaste.addWaste(payload);

      if (response.has_internal_error) {
        notification.error({
          message: "Erro ao cadastrar desperdício",
          duration: 5,
        });
      } else {
        notification.success({
          message: "Desperdício cadastrado com sucesso",
          duration: 5,
        });

        setVisible(false);
        form.resetFields();
      }
      setLoading(false);
      setShouldSearch(true);
    } catch (error) {
      notification.error({
        message: "Oops, ocorreu um erro!",
        duration: 5,
      });
    } finally {
      setLoading(false);
      setShouldSearch(false);
    }
  };

  const handleUpload = async (file: File) => {
    const imageToUpload = new FormData();
    imageToUpload.append("file", file);

    const {
      data: { location, key },
    } = await s3Api.post(`/s3-upload/upload/waste-files`, imageToUpload);
    return { url_file: location, s3_key: key };
  };

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
              setVisible(false);
              form.resetFields();
            }}
          >
            Cancelar
          </ButtonCancel>
          <ButtonSave onClick={handleSave}>Salvar</ButtonSave>
        </Footer>
      }
    >
      <Form layout="vertical" form={form}>
        <ContentModalBody gutter={24}>
          <ColModal sm={24}>
            <Form.Item
              label="Produto"
              name="product_id"
              rules={[{ required: true, message: "Selecione um produto" }]}
            >
              <SelectSearch
                showSearch
                placeholder={`Escolha a opção` || selectedProduct}
                onChange={(value: any) => setSelectedProduct(value)}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {productsStore.map((item) => (
                  <Option value={item.product_id} key={item.product_id}>
                    {item.product.name}
                  </Option>
                ))}
              </SelectSearch>
            </Form.Item>
          </ColModal>

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
                <Radio value={Options.Quilograma}>Quilograma</Radio>
                <Radio value={Options.Unidade}>Unidade</Radio>
              </Radio.Group>
            </Form.Item>
          </ColModal>

          <ColModal sm={24}>
            <Form.Item
              label="Quantidade"
              name="quantity"
              rules={[{ required: true, message: "Digite a quantidade" }]}
              normalize={(value) => parseFloat(value)}
            >
              <Input
                type="number"
                placeholder="Digite aqui"
                addonAfter={unitSuffix}
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
        </ContentModalBody>
      </Form>
    </Modal>
  );
};

export default ModalAddWaste;
