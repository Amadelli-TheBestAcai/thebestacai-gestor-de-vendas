import { notification } from "antd";
import React, { useState, useEffect } from "react";

import StockList from "../../containers/StockList";

import { ProductDto } from "../../models/dtos/product";
import { RestrictedProducts } from "../../models/enums/restrictedProducts";

import {
  Container,
  PageContent,
  Header,
  SearchContainer,
  Input,
  Content,
  SearchIcon,
} from "./styles";

const Stock: React.FC = () => {
  const [productsStock, setProductsStock] = useState<ProductDto[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<
    ProductDto[] | undefined
  >(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const { response: products, has_internal_error: errorOnProducts } =
        await window.Main.product.getAllProductStore();
      if (errorOnProducts) {
        notification.error({
          message: "Erro ao encontrar todos produtos",
          duration: 5,
        });
      }
      setProductsStock(
        products?.filter(
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
      <PageContent>
        <Header>
          <h2>Estoque</h2>
        </Header>
        <SearchContainer>
          <Input
            placeholder="Digite o nome do produto"
            onChange={findProduct}
            prefix={<SearchIcon />}
          />
        </SearchContainer>
        <Content>
          <StockList
            loading={loading}
            setLoading={setLoading}
            filteredProducts={filteredProducts}
            products={productsStock}
            setProductsStock={setProductsStock}
          />
        </Content>
      </PageContent>
    </Container>
  );
};

export default Stock;
