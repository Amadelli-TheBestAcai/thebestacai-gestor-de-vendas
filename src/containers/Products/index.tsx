import React, { useEffect, useState } from "react";
import { ProductDto } from "../../models/dtos/product";

import Spinner from "../../components/Spinner";
import Product from "../../components/Product";
import Centralizer from "../../containers/Centralizer";
import EmptyProduct from "../../assets/svg/EmptyProduct.svg";

import { notification, Empty } from "antd";

import {
  Container,
  TabContainer,
  ProductSearch,
  InputSearchProduct,
  TabItem,
  IconContainer,
  SearchIcon,
  Header,
  Column,
  ProductsContent,
  LoadingContainer,
} from "./styles";

type ProductByCategory = {
  category: string;
  products: ProductDto[];
};

const ProductsContainer: React.FC = () => {
  const [searchByName, setSearchByName] = useState<string>("");
  const [products, setProducts] = useState<ProductByCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const { response: products, has_internal_error: errorOnProducts } =
        await window.Main.product.getProducts(true);
      if (errorOnProducts) {
        notification.error({
          message: "Erro ao encontrar todos produtos",
          duration: 5,
        });
      }
      const categories = products
        ?.filter((_product) => _product.product.category.id !== 1)
        ?.map((_product) => _product.product.category.name)
        .filter((item, pos, self) => self.indexOf(item) == pos);

      const payload = categories?.map((_category) => ({
        category: _category,
        products: products.filter(
          (_product) => _product.product.category.name === _category
        ),
      }));
      setProducts(payload);
      setLoading(false);
    }
    init();
  }, []);

  const handleFilter = (
    payload: ProductByCategory,
    pattern?: string
  ): ProductByCategory => {
    if (pattern && pattern.length) {
      const products = payload.products.filter((_product) =>
        _product.product.name.toLowerCase()?.includes(pattern.toLowerCase())
      );
      return {
        category: payload.category,
        products,
      };
    }
    return payload;
  };

  return (
    <Container>
      {loading ? (
        <LoadingContainer>
          <Spinner />
        </LoadingContainer>
      ) : (
        <>
          {products?.length !== 0 ? (
            <TabContainer
              defaultActiveKey="1"
              onChange={() => setSearchByName("")}
            >
              {products?.map((productCategory, index) => (
                <TabItem tab={productCategory.category} key={index + 1}>
                  <ProductSearch>
                    <IconContainer>
                      <SearchIcon />
                    </IconContainer>
                    <InputSearchProduct
                      placeholder="Procurar item"
                      value={searchByName}
                      onChange={({ target: { value } }) =>
                        setSearchByName(value || "")
                      }
                    />
                  </ProductSearch>

                  <Header>
                    <Column sm={11}>Produto</Column>
                    <Column sm={8}>Preço</Column>
                    <Column sm={5}>Ação</Column>
                  </Header>

                  <ProductsContent>
                    {handleFilter(productCategory, searchByName).products.map(
                      (product) => (
                        <Product key={product.product_id} product={product} />
                      )
                    )}
                  </ProductsContent>
                </TabItem>
              ))}
            </TabContainer>
          ) : (
            <Centralizer>
              <Empty
                description="Não existe nenhum produto cadastro para venda nesta loja. Acesse o Dashboard para cadastrar novos Produtos do Gestor"
                image={EmptyProduct}
                imageStyle={{
                  height: 200,
                }}
              />
            </Centralizer>
          )}
        </>
      )}
    </Container>
  );
};

export default ProductsContainer;
