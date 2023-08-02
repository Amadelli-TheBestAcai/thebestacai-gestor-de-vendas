import React from "react";
import { useSale } from "../../hooks/useSale";

import { StoreProductDto } from "../../models/dtos/storeProduct";

import { Tooltip } from "antd";

import { Container, Column, AddIcon } from "./styles";

interface IProps {
  product: StoreProductDto;
}
const Product: React.FC<IProps> = ({ product }) => {
  const { onAddItem } = useSale();
  const handleItem = async () => {
    await onAddItem(product, 1);
  };

  return (
    <Container>
      <Column span={11}>{product.product.name}</Column>
      <Column span={8}>
        {(+product.price_unit).toFixed(2).replace(".", ",")}
      </Column>
      <Column span={5}>
        <Tooltip title="Adicionar" placement="right">
          <AddIcon onClick={handleItem} />
        </Tooltip>
      </Column>
    </Container>
  );
};

export default Product;
