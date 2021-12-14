import React, { useEffect, useState } from "react";
import { ProductDto } from "../../models/dtos/product";

import Product from "../../components/Product";

import {
  Container,
  LoadingContainer,
  Spin,
  TabContainer,
  TabItem,
  ProductHeader,
  ProductHeaderCol,
  ProductHeaderDescription,
} from "./styles";

type ProductByCategory = {
  category: string;
  products: ProductDto[];
};

interface IProps {
  addProduct: (product: ProductDto, quantity: number) => Promise<void>;
}

const ProductsContainer: React.FC<IProps> = ({ addProduct }) => {
  const [products, setProducts] = useState<ProductByCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    async function init() {
      setLoading(true);
      const products = await window.Main.product.getProducts();
      const categories = products
        .map((_product) => _product.product.category.name)
        .filter((item, pos, self) => self.indexOf(item) == pos);

      const payload = categories.map((_category) => ({
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

  return (
    <Container>
      {loading ? (
        <LoadingContainer>
          <Spin />
        </LoadingContainer>
      ) : (
        <TabContainer defaultActiveKey="1">
          {products?.map((productCategory, index) => (
            <TabItem tab={productCategory.category} key={index + 1}>
              <ProductHeader>
                <ProductHeaderCol span={8}>
                  <ProductHeaderDescription>Produtos</ProductHeaderDescription>
                </ProductHeaderCol>
                <ProductHeaderCol span={6}>
                  <ProductHeaderDescription>Preço</ProductHeaderDescription>
                </ProductHeaderCol>
                <ProductHeaderCol span={4}>
                  <ProductHeaderDescription>Add</ProductHeaderDescription>
                </ProductHeaderCol>
              </ProductHeader>
              {productCategory.products.map((product) => (
                <Product
                  key={product.product_id}
                  product={product}
                  addProduct={addProduct}
                />
              ))}
            </TabItem>
          ))}
        </TabContainer>
      )}
    </Container>
  );
};

export default ProductsContainer;
