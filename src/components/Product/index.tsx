import React from "react";

import { ProductDto } from "../../models/dtos/product";

import { Container, Column, Description, AddIcon } from "./styles";

interface IProps {
  product: ProductDto;
  addProduct: (product: ProductDto, quantity: number) => Promise<void>;
}
const Product: React.FC<IProps> = ({ product, addProduct }) => {
  const handleItem = async () => {
    await addProduct(product, 1);
  };

  return (
    <Container>
      <Column span={8}>
        <Description>{product.product.name}</Description>
      </Column>
      <Column span={6}>
        <Description>
          {(+product.price_unit).toFixed(2).replace(".", ",")}
        </Description>
      </Column>
      <Column span={4}>
        <AddIcon onClick={handleItem} />
      </Column>
    </Container>
  );
};

export default Product;
