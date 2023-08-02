import React, { Dispatch, SetStateAction, useState } from "react";

import { Empty, Tooltip } from "antd";
import { SearchIcon } from "../../pages/Waste/styles";
import { ProductDto } from "../../models/dtos/product";
import { EmptyContainer } from "../Items/styles";
import { Spinner } from "styled-icons/fa-solid";
import ModalAddWaste from "../ModalAddWaste";
import {
  Col,
  Container,
  Content,
  Header,
  Input,
  ContentLeft,
  Tupla,
  ContentGeneral,
  AddIcon,
} from "./styles";

interface IProps {
  products: ProductDto[];
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
}

const WasteList: React.FC<IProps> = ({ products, setLoading, loading }) => {
  const [productSearch, setProductSearch] = useState("");
  const [modalState, setModalState] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(
    null
  );

  const findProduct = (value: string) => {
    return value?.length
      ? products.filter((product) => product.name.includes(value))
      : products;
  };

  return (
    <Container>
      {loading ? (
        <Spinner />
      ) : (
        <Content>
          <ContentLeft>
            <Header>
              <Col sm={4}>Id do produto</Col>
              <Col sm={6}>Categoria</Col>
              <Col sm={10}>Produto</Col>
              <Col sm={4}>Ação</Col>
            </Header>

            <Input
              placeholder="Digite o nome do produto"
              prefix={<SearchIcon />}
              onChange={({ target: { value } }) => setProductSearch(value)}
              style={{ marginTop: "0.5rem" }}
            />

            {findProduct(productSearch).length !== 0 ? (
              <ContentGeneral>
                {findProduct(productSearch).map((product) => {
                  return (
                    <Tupla key={product.id}>
                      <Col sm={4}>{product.id}</Col>
                      <Col sm={6}>{product.category.name}</Col>
                      <Col sm={10}>{product.name}</Col>
                      <Col sm={4}>
                        <Tooltip
                          title={`Adicionar desperdicio de ${product.name}`}
                        >
                          <AddIcon
                            onClick={() => {
                              setModalState(true);
                              setSelectedProduct(product);
                            }}
                          />
                        </Tooltip>
                      </Col>
                    </Tupla>
                  );
                })}
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
        </Content>
      )}

      <ModalAddWaste
        setVisible={setModalState}
        visible={modalState}
        setLoading={setLoading}
        loading={loading}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
      />
    </Container>
  );
};

export default WasteList;
