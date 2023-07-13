import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Modal, Radio, notification } from "antd";
import { ProductDto } from "../../../models/dtos/product";
import { ProductWasteDTO } from "../../../models/dtos/productWaste";
import { Options } from "../../../models/enums/weightOptions";
import s3Api from "../../../helpers/s3Api";
import Upload from "../../../components/Upload";
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
  products,
  setShouldSearch,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<
    ProductDto | undefined
  >(undefined);
  const [value, setValue] = useState(Options.Quilograma);
  const [uploadedFile, setUploadedFile] = useState<{
    url_file: any;
    s3_key: any;
  }>({ url_file: "", s3_key: "" });

  const [form] = Form.useForm();
  const { store } = useStore();
  const { cashHistoryId } = useCashHistoryId();

  const handleDeleteUpload = async () => {
    setLoading(true);

    Modal.confirm({
      title: "Excluir imagem",
      content: "Você deseja excluir esta imagem?",

      async onOk() {
        try {
          if (uploadedFile?.s3_key) {
            await s3Api.delete(
              `/s3-upload/upload/waste-files/${uploadedFile?.s3_key}`
            );
          }

          setShouldSearch(true);
        } catch (error) {
          notification.error({
            message: "Erro ao excluir imagem",
            duration: 5,
          });
        }
      },
    });

    setLoading(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const values = form.getFieldsValue();

      const payload = {
        ...values,
        cash_history_id: cashHistoryId.history_id,
        store_id: store.company_id,
        s3_key: uploadedFile.s3_key,
        url_file: uploadedFile.url_file,
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
    setUploadedFile({ url_file: location, s3_key: key });
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
              <input
                type="file"
                onChange={({ target: { files } }) => handleUpload(files[0])}
              />
            </Form.Item>
          </ColModal>
        </ContentModalBody>
      </Form>
    </Modal>
  );
};

export default ModalAddWaste;
