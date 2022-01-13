import React, { useState, useEffect } from "react";

import RouterDescription from "../../components/RouterDescription";
import StockList from "../../containers/StockList";

import { ProductDto } from "../../models/dtos/product";
import { RestrictedProducts } from "../../models/enums/restrictedProducts";

import { Input } from "antd";
import { Container, TopSide, Content, Col, Row } from "./styles";

const Stock: React.FC = () => {
  const [productsStock, setProductsStock] = useState<ProductDto[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<
    ProductDto[] | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const products = await window.Main.product.getAllProductStore();
      setProductsStock(
        products.filter(
          (data) =>
            data.product_id !== RestrictedProducts.SELFSERVICE &&
            data.product_id !== RestrictedProducts.DELIVERY
        )
      );
      setLoading(false);
    }
    init();
  }, []);

  const findProduct = ({ target: { value } }) => {
    const filteredProducts = productsStock.filter((product) =>
      product?.product?.name?.includes(value)
    );
    setFilteredProducts(filteredProducts);
  };

  return (
    <Container>
      <RouterDescription description="Estoque" />
      <TopSide>
        <Row>
          <Col sm={6} xs={24}>
            <Input
              placeholder="Digite o nome do produto"
              onChange={findProduct}
            />
          </Col>
        </Row>
      </TopSide>
      <Content>
        <StockList
          loading={loading}
          setLoading={setLoading}
          filteredProducts={filteredProducts}
          products={productsStock}
          setProductsStock={setProductsStock}
        ></StockList>
      </Content>
    </Container>
  );
};

export default Stock;
