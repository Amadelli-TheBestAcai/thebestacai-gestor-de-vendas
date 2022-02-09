import React, { SetStateAction, Dispatch, useState } from "react";

import StockAuditList from "../../containers/StockAuditList";
import Spinner from "../../components/Spinner";
import notImage from "../../assets/svg/notImage.svg";

import { Page } from "../../models/dtos/page";
import { ProductDto } from "../../models/dtos/product";

import { Modal, notification, Dropdown, Menu } from "antd";

import {
  Container,
  Header,
  Col,
  Tupla,
  Content,
  Status,
  MoreInfo,
  ButtonCancel,
  ButtonSave,
  EditInfo,
  Footer,
  Input,
  InputChange,
  QtdChange,
  QtdCurrent,
  UpdateContainer,
} from "./styles";

const { confirm } = Modal;

interface IProps {
  products: ProductDto[];
  filteredProducts: ProductDto[];
  setLoading: Dispatch<SetStateAction<boolean>>;
  setProductsStock: Dispatch<SetStateAction<ProductDto[]>>;
  loading: boolean;
}

const StockList: React.FC<IProps> = ({
  products,
  filteredProducts,
  loading,
  setLoading,
  setProductsStock,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(
    null
  );
  const [newQuantity, setNewQuantity] = useState<number | undefined>(undefined);
  const [paginate, setPaginate] = useState<Page>({
    page: 1,
    size: 10,
    totalElements: 0,
  });

  const getQuatity = (quantity?: number): string => {
    if (quantity <= 0 || !quantity) {
      return "Negativo";
    }
    if (quantity <= 3) {
      return "Estoque baixo";
    }
    return "";
  };

  const handleUpdateProduct = async () => {
    confirm({
      title: "Atualizar Produto",
      content: "Gostaria de prosseguir com a atualização deste produto?",
      okText: "Sim",
      okType: "default",
      cancelText: "Não",
      centered: true,
      async onOk() {
        setLoading(true);
        setIsModalVisible(false);
        await window.Main.product.updateProductStock(
          selectedProduct?.id,
          (+selectedProduct?.quantity || 0) - (newQuantity || 0)
        );
        if (products) {
          const productIndex = products.findIndex(
            (product) => product.id === selectedProduct?.id
          );

          const newProduct = products;
          newProduct[productIndex].quantity =
            (+selectedProduct?.quantity || 0) - (newQuantity || 0);
          setProductsStock([...newProduct]);
          setSelectedProduct(null);
          setLoading(false);
          return notification.success({
            message: "Produto atualizado com sucesso!",
            description: `O produto selecionado foi atualizado com sucesso.`,
            duration: 5,
          });
        } else {
          return notification.error({
            message: "Oops! Não foi possível atualizar este produto!",
            description: `O produto selecionado não foi atualizado. 
            Tente novamente, se o erro persistir entre em contato através do chat de suporte.`,
            duration: 5,
          });
        }
      },
      onCancel() {
        setIsModalVisible(false);
      },
    });
  };

  return (
    <Container>
      <Header>
        <Col sm={6}>Imagem</Col>
        <Col sm={6}>Produto</Col>
        <Col sm={4}>Quantidade</Col>
        <Col sm={4}>Status</Col>
        <Col sm={4}>Ações</Col>
      </Header>

      {loading ? (
        <Spinner />
      ) : (
        <Content>
          {(filteredProducts || products).map((storeProduct) => (
            <Tupla key={storeProduct.id}>
              <Col sm={6}>
                <img src={notImage} alt="Imagem não encontrada" />
              </Col>
              <Col sm={6}>{storeProduct.product?.name}</Col>
              <Col sm={4}>{storeProduct.quantity}</Col>
              <Col sm={4}>
                <Status quantity={storeProduct?.quantity}>
                  {getQuatity(storeProduct?.quantity)}
                </Status>
              </Col>
              <Col sm={4}>
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item
                        onClick={() => {
                          setNewQuantity(undefined);
                          setIsModalVisible(true);
                          setSelectedProduct(storeProduct);
                        }}
                      >
                        Editar
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => {
                          setPaginate((oldValues) => ({
                            ...oldValues,
                            page: 1,
                            size: 10,
                          }));
                          setSelectedProduct(storeProduct);
                          setVisible(true);
                        }}
                      >
                        Histórico
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={["click"]}
                  placement="bottomLeft"
                >
                  <MoreInfo />
                </Dropdown>
              </Col>
            </Tupla>
          ))}

          <StockAuditList
            visible={visible}
            setVisible={setVisible}
            id={selectedProduct?.id}
            paginate={paginate}
            setPaginate={setPaginate}
          />
        </Content>
      )}

      <Modal
        title="Editar"
        visible={isModalVisible}
        centered
        closable={false}
        footer={
          <Footer>
            <ButtonCancel onClick={() => setIsModalVisible(false)}>
              Cancelar
            </ButtonCancel>
            <ButtonSave onClick={() => handleUpdateProduct()}>
              Salvar alteração
            </ButtonSave>
          </Footer>
        }
      >
        <UpdateContainer>
          <QtdCurrent>
            <EditInfo>Quantidade atual:</EditInfo>
            <Input type="number" disabled value={selectedProduct?.quantity} />
          </QtdCurrent>
          <QtdChange>
            <EditInfo>Retirar:</EditInfo>
            <InputChange
              type="number"
              value={newQuantity}
              onChange={({ target: { value } }) => setNewQuantity(+value)}
            />
          </QtdChange>
        </UpdateContainer>
      </Modal>
    </Container>
  );
};

export default StockList;
