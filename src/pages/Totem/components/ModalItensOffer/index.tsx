import React, { Dispatch, SetStateAction } from "react";

import { StoreProductDto } from "../../../../models/dtos/storeProduct";

import { removeAccents } from "../../helpers/removeAccents";

import ProductCard from "../ProductCard";

import { Container, ButtonContinue, ProductList, Product } from "./styles";

interface IProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  stepChange: (step: number) => void;
  storeProducts: StoreProductDto[];
}
const ModalItensOffer: React.FC<IProps> = ({
  visible,
  setVisible,
  stepChange,
  storeProducts,
}) => {
  return (
    <Container
      visible={visible}
      closable={false}
      centered
      width={"62.5rem"}
      style={{ height: "48.5rem" }}
      footer={false}
    >
      <>
        <span
          className="modal-title"
          onClick={() => console.log(storeProducts)}
        >
          {"Que tal levar uma água?"}
        </span>
        <ProductList>
          {storeProducts
            .filter((_product) =>
              removeAccents(_product?.product?.name)?.startsWith("agua")
            )
            .map((storeProduct) => (
              <Product>
                <ProductCard
                  key={storeProduct.id}
                  storeProduct={storeProduct}
                  onClick={() => setVisible(false)}
                />
              </Product>
            ))}
        </ProductList>
        <div className="modal-footer">
          <ButtonContinue
            onClick={() => {
              stepChange(5);
              setVisible(false);
            }}
          >
            Pula
          </ButtonContinue>
        </div>
      </>
    </Container>
  );
};

export default ModalItensOffer;
