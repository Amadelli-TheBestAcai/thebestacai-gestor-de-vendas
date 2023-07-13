import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { Spinner } from "styled-icons/fa-solid";
import { Tooltip } from "antd";
import { SearchIcon } from "../../pages/Waste/styles";
import ModalImageWaste from "../../pages/Waste/ModalImageWaste";
import ModalAddWaste from "./ModalAddWaste";
import { ProductDto } from "../../models/dtos/product";
import { ProductWasteDTO } from "../../models/dtos/productWaste";

export enum Options {
  Unidade = 0,
  Quilograma = 1,
}

interface IProps {
  products: ProductWasteDTO[];
  productsStore: ProductDto[];
  filteredProducts: ProductWasteDTO[];
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  findProduct: (event: React.ChangeEvent<HTMLInputElement>) => void;
  deleteWaste: (id: number) => void;
  setShouldSearch: any;
}

const WasteList: React.FC<IProps> = ({
  products,
  setLoading,
  loading,
  findProduct,
  filteredProducts,
  productsStore,
  deleteWaste,
  setShouldSearch
}) => {
  const [modalState, setModalState] = useState(false);
  const [modalImage, setModalImage] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Options | undefined>(
    undefined
  );

  const productsToRender =
    filteredProducts.length > 0 ? filteredProducts : products;

  const sortedRanking = productsToRender.sort(
    (a, b) => b.quantity - a.quantity
  );

  const filteredRanking = sortedRanking.filter((column) => {
    if (selectedOption === Options.Unidade) {
      return column.products_store_waste.some((product) => product.unity === 0);
    } else if (selectedOption === Options.Quilograma) {
      return column.products_store_waste.some((product) => product.unity === 1);
    }
    return true;
  });

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
            <ContentGeneral>
              {productsToRender.map((product) =>
                product.products_store_waste.map((waste) => {
                  return (
                    <Tupla key={waste.id}>
                      <Col sm={6}>{waste.created_at}</Col>
                      <Col sm={4}>{product.id}</Col>
                      <Col sm={5}>{product.name}</Col>
                      <Col sm={5}>{`${waste.quantity} KG`}</Col>
                      <Col sm={4}>
                        <Tooltip title="Imagens">
                          <ImageIcon onClick={() => setModalImage(true)} />
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
            <ContentGeneralLeft>
              {filteredRanking.map((column, index) => (
                <Tupla key={column.id}>
                  <Col sm={8}>{`${index + 1}º`}</Col>
                  <Col sm={8}>{column.name}</Col>
                  <Col sm={8}>
                    {column.products_store_waste.map((item) => (
                      <span key={item.id}>
                        {item.quantity} {item.unity === 0 ? "un" : "kg"}
                      </span>
                    ))}
                  </Col>
                </Tupla>
              ))}
            </ContentGeneralLeft>
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
      // setVisible={setModalImage}
      // visible={modalImage}
      // productsWaste={products}
      // setLoading={setLoading}
      // loading={loading}
      />
    </Container>
  );
};

export default WasteList;