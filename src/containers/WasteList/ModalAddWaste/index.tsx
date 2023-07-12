import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Modal, Radio, Tooltip, notification } from "antd";
import {
  Form,
  ButtonCancel,
  ButtonSave,
  ColModal,
  ContentModalBody,
  Footer,
  Input,
  SelectSearch,
  UploadContainer,
  Option,
  UploadContent,
} from "./styles";
import { Options } from "..";
import Upload from "../../../components/Upload";
import { ProductDto } from "../../../models/dtos/product";
import {
  ProductStoreWasteDto,
  ProductWasteDTO,
} from "../../../models/dtos/productWaste";

interface IProps {
  visible: boolean;
  loading: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  productsStore: ProductDto[];
  products: ProductWasteDTO[];
  setShouldSearch: any;
}

const ModalAddWaste: React.FC<IProps> = ({
  setVisible,
  visible,
  setLoading,
  productsStore,
  products,
  setShouldSearch,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<
    ProductDto | undefined
  >(undefined);
  const [value, setValue] = useState(Options.Quilograma);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [form] = Form.useForm();

  const handleSave = async () => {
    setLoading(true);
    try {
      const values = form.getFieldsValue();
      const payload = {
        ...values,
        cash_history_id: 151058,
        store_id: 141,
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
      console.error("Erro ao salvar:", error);
    } finally {
      setLoading(false);
      setShouldSearch(false);
    }
  };

  const handleUpload = (file: File): void => {
    if (uploadedFile !== null) {
      return notification.warning({
        message: "Limite máximo de imagem excedido",
        description: "Você já fez o upload de uma imagem.",
        duration: 5,
      });
    }

    setUploadedFile(file);
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
          <ColModal sm={12}>
            <Form.Item
              label="Produto"
              name="product_id"
              rules={[{ required: true, message: "Selecione um produto" }]}
            >
              <SelectSearch
                placeholder="Escolha a opção"
                onChange={(value: any) => setSelectedProduct(value)}
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
              label="Quantidade"
              name="quantity"
              rules={[{ required: true, message: "Digite a quantidade" }]}
              normalize={(value) => parseFloat(value)}
            >
              <Input type="number" placeholder="Digite aqui" />
            </Form.Item>
          </ColModal>

          <ColModal sm={12}>
            <Form.Item
              label=""
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
            <Form.Item label="Upload de imagem" name="url_file">
              <UploadContainer>
                {uploadedFile ? (
                  <UploadContent>
                    <span>Imagem</span>
                    <button onClick={() => setUploadedFile(null)}>
                      remover
                    </button>
                  </UploadContent>
                ) : (
                  <Upload
                    onUpload={handleUpload}
                    fileType="image/*"
                    dropzoneMsg="Arraste seu arquivo ou procure aqui!"
                  />
                )}
              </UploadContainer>
            </Form.Item>
          </ColModal>
        </ContentModalBody>
      </Form>
    </Modal>
  );
};

export default ModalAddWaste;
