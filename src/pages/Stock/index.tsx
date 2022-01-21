import React, { useState, useEffect } from "react";

import StockList from "../../containers/StockList";

import { ProductDto } from "../../models/dtos/product";
import { RestrictedProducts } from "../../models/enums/restrictedProducts";

import { Container, Content, Name, SearchBar } from "./styles";

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
      <Content>
        <Name>Estoque</Name>
        <SearchBar
          placeholder="Digite o nome do produtos"
          onChange={findProduct}
        ></SearchBar>
        <StockList
          loading={loading}
          setLoading={setLoading}
          filteredProducts={filteredProducts}
          products={productsStock}
          setProductsStock={setProductsStock}
        />
      </Content>
    </Container>
  );
};

export default Stock;
