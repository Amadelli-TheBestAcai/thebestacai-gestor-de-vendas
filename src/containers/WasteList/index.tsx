import React, { Dispatch, SetStateAction, useState } from "react";
import moment from "moment";
import { Empty, Tooltip } from "antd";
import { SearchIcon } from "../../pages/Waste/styles";
import { ProductDto } from "../../models/dtos/product";
import { Options } from "../../models/enums/weightOptions";
import { EmptyContainer } from "../Items/styles";
import { Spinner } from "styled-icons/fa-solid";
import ModalAddWaste from "../../pages/Waste/ModalAddWaste";
import ModalImageWaste from "../../pages/Waste/ModalImageWaste";
import {
  ProductStoreWasteDto,
  ProductWasteDTO,
} from "../../models/dtos/productWaste";
import {
  Col,
  Container,
  Content,
  Header,
  TrashIcon,
  ImageIcon,
  Input,
  ContentLeft,
  ContentRight,
  Tupla,
  ButtonWaste,
  ContentWaste,
  SelectSearch,
  Option,
  ContentGeneral,
  ContentGeneralLeft,
} from "./styles";

interface IProps {
  products: ProductWasteDTO[];
  productsStore: ProductDto[];
  filteredProducts: ProductWasteDTO[];
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  findProduct: (event: React.ChangeEvent<HTMLInputElement>) => void;
  deleteWaste: (id: number) => void;
  setShouldSearch: Dispatch<SetStateAction<boolean>>;
}

const WasteList: React.FC<IProps> = ({
  products,
  setLoading,
  loading,
  findProduct,
  filteredProducts,
  productsStore,
  deleteWaste,
  setShouldSearch,
}) => {
  const [modalState, setModalState] = useState(false);
  const [modalImage, setModalImage] = useState(false);
  const [productSelect, setProductSelect] = useState<ProductStoreWasteDto[]>();
  const [selectedOption, setSelectedOption] = useState<Options | undefined>(
    undefined
  );

  const productsToRender =
    filteredProducts.length > 0 ? filteredProducts : products;

  const filteredRanking = products
    .filter((productStore) => {
      if (selectedOption === Options.Unidade) {
        return productStore.products_store_waste.some(
          (product) => product.unity === 0
        );
      } else if (selectedOption === Options.Quilograma) {
        return productStore.products_store_waste.some(
          (product) => product.unity === 1
        );
      }
      return true;
    })
    .sort(
      (a, b) =>
        b.products_store_waste.reduce(
          (total, item) => total + +item.quantity,
          0
        ) -
        a.products_store_waste.reduce(
          (total, item) => total + +item.quantity,
          0
        )
    );

  const getTotalQuantityByUnity = (productStore, unity) => {
    return productStore.products_store_waste.reduce((total, item) => {
      if (item.unity === unity) {
        return total + +item.quantity;
      }
      return total;
    }, 0);
  };

  const renderQuantity = (productStore, unity, unitLabel) => {
    const totalQuantity = getTotalQuantityByUnity(productStore, unity);
    return totalQuantity > 0 ? `${totalQuantity} ${unitLabel} ` : null;
  };

  return (
    <Container>
      {loading ? (
        <Spinner />
      ) : (
        <Content>
          <ContentLeft>
            <ContentWaste>
              <span>Lista de desperdício</span>
              <ButtonWaste onClick={() => setModalState(true)}>
                Novo desperdício
              </ButtonWaste>
            </ContentWaste>
            <Header>
              <Col sm={6}>Data e hora</Col>
              <Col sm={4}>Id do produto</Col>
              <Col sm={5}>Produto</Col>
              <Col sm={5}>Quantidade</Col>
              <Col sm={4}>Ação</Col>
            </Header>

            <Input
              placeholder="Digite o nome do produto"
              prefix={<SearchIcon />}
              onChange={findProduct}
              style={{ marginTop: "0.5rem" }}
            />

            {products.length !== 0 ? (
              <ContentGeneral>
                {productsToRender.map((product) =>
                  product.products_store_waste.map((waste) => {
                    const unitLabel = waste.unity === 0 ? "un" : "kg";
                    return (
                      <Tupla key={waste.id}>
                        <Col sm={6}>
                          {moment(waste.created_at, "DD-MM-YYYY HH:mm:ss")
                            .subtract(3, "hours")
                            .format("DD/MM/YYYY HH:mm:ss")}
                        </Col>
                        <Col sm={4}>{product.id}</Col>
                        <Col sm={5}>{product.name}</Col>
                        <Col sm={5}>
                          {+waste.unity === 0
                            ? Math.floor(+waste.quantity)
                            : parseFloat(waste.quantity).toFixed(3)}{" "}
                          {unitLabel}
                        </Col>
                        <Col sm={4}>
                          <Tooltip title="Imagens">
                            <ImageIcon
                              onClick={() => {
                                setModalImage(true);
                                setProductSelect([waste]);
                              }}
                            />
                          </Tooltip>
                          <Tooltip title="Excluir desperdício">
                            <TrashIcon onClick={() => deleteWaste(waste.id)} />
                          </Tooltip>
                        </Col>
                      </Tupla>
                    );
                  })
                )}
              </ContentGeneral>
            ) : (
              <EmptyContainer>
                <Empty
                  description="Não há desperdício cadastrado nesta data"
                  style={{ height: "55%" }}
                />
              </EmptyContainer>
            )}
          </ContentLeft>
          <ContentRight>
            <ContentWaste>
              <span>Ranking de desperdício</span>
              <SelectSearch
                placeholder="Escolha a opção"
                defaultValue={"Todos os produtos"}
                onChange={(value: any) => setSelectedOption(value)}
              >
                <Option value={""}>Todos os produtos</Option>
                <Option value={Options.Unidade}>Por unidade</Option>
                <Option value={Options.Quilograma}>Por kg</Option>
              </SelectSearch>
            </ContentWaste>

            <Header>
              <Col sm={8}>Posição</Col>
              <Col sm={8}>Produto</Col>
              <Col sm={8}>Quantidade</Col>
            </Header>

            {products.length !== 0 ? (
              <ContentGeneralLeft>
                {filteredRanking.map((productStore, index) => (
                  <Tupla key={productStore.id}>
                    <Col sm={8}>{`${index + 1}º`}</Col>
                    <Col sm={8}>{productStore.name}</Col>
                    <Col sm={8}>
                      {renderQuantity(productStore, 0, "un")}
                      {renderQuantity(productStore, 1, "kg")}
                    </Col>
                  </Tupla>
                ))}
              </ContentGeneralLeft>
            ) : (
              <EmptyContainer>
                <Empty description="Não há desperdício cadastrado nesta data" />
              </EmptyContainer>
            )}
          </ContentRight>
        </Content>
      )}

      <ModalAddWaste
        setVisible={setModalState}
        visible={modalState}
        setLoading={setLoading}
        loading={loading}
        productsStore={productsStore}
        products={products}
        setShouldSearch={setShouldSearch}
      />
      <ModalImageWaste
        setVisible={setModalImage}
        visible={modalImage}
        products={productSelect}
        setLoading={setLoading}
        loading={loading}
      />
    </Container>
  );
};

export default WasteList;
