import React, { Dispatch, SetStateAction } from "react";

import plus from "../../../../assets/totem/svg/plus.svg";

import { getCategoryIcon } from "../../helpers/getCategoryIcon";

import { useSale } from "../../../../hooks/useSale";

import { StoreProductDto } from "../../../../models/dtos/storeProduct";

import { Container } from "./styles";

interface IProps {
  key: string | number;
  storeProduct: StoreProductDto;
  onClick?: () => void;
}

const ProductCard: React.FC<IProps> = ({ key, storeProduct, onClick }) => {
  const { onAddItem } = useSale();

  const onClickClose = async () => {
    onAddItem(storeProduct, 1, +storeProduct.price_unit);

    onClick && onClick();
  };

  return (
    <Container key={key} onClick={() => onClickClose()}>
      <img className="product-img-add" src={plus} />
      <img
        className="product-img"
        src={
          storeProduct?.product?.upload_url
            ? storeProduct?.product?.upload_url?.toString()
            : getCategoryIcon(storeProduct.product.category)
        }
      />

      <span className="product-name">{storeProduct.product.name}</span>
      <span className="product-price">
        R$
        {storeProduct.price_unit?.replace(".", ",")}
      </span>
    </Container>
  );
};

export default ProductCard;
