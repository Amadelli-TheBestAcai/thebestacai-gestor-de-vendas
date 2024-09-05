import styled, { css } from "styled-components";
import {
  Button as ButtonAnt,
  Input as InputAnt,
  Row as RowAnt,
  Col as ColAnt,
} from "antd";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 1.25rem 2.5rem 0;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-height: 4.87rem;
  height: 10%;
  font-size: 2.5rem;

  .bag-content {
    display: flex;
    justify-content: space-between;
    align-items: end;
    width: 16.5rem;
    font-weight: 600;

    span {
      height: 2.7rem;
    }
  }
  .price-content {
    display: flex;
    justify-content: space-between;
    align-items: end;
    font-weight: 800;
    span {
      height: 2.7rem;
    }
  }
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 57.37rem;
  height: 100%;
  padding: 3rem 0;

  .self-service-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    font-size: 4rem;
    font-weight: 600;
    text-align: center;
  }

  .order-list-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-height: 35rem;
  }

  .extra-product-title {
    font-size: 2.5rem;
    text-align: start;
    margin: 2.5rem 0 1rem;
  }

  .extra-products-content {
    width: 100%;
    max-height: 33rem;
    .extra-products-list {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      overflow: hidden;
    }
  }
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 2.5rem;
`;

export const OrderProductList = styled(RowAnt)`
  width: 100%;
  overflow-y: scroll;
`;

export const OrderProduct = styled(ColAnt)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 10rem;
  margin: 0.5rem 0;
  padding: 1.25rem 2.5rem;
  background: var(--orange-190);
  border-radius: 0.625rem;

  .order-item-content {
    display: flex;
    flex-direction: row;
  }
  .order-item-image {
    width: 7.5rem;
    height: 7.5rem;
    margin-right: 0.18rem;
    background-size: cover;
    background-position: center;
  }
  .order-item-info {
    display: flex;
    justify-content: center;
    flex-direction: column;
    font-weight: 600;

    .order-item-name {
      font-size: 2rem;
    }
    .order-item-price {
      font-size: 1.5rem;
    }
  }
  .order-item-actions {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
    width: 16rem;
  }
`;

export const AddSubItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 10.56rem;
  height: 3.125rem;
  font-weight: 700;
  font-size: 2rem;

  .product-img-add {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--orange-250);
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    cursor: pointer;
  }

  .product-img-sub {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--white);
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    cursor: pointer;
  }
`;

export const ExtraProductList = styled(RowAnt)`
  width: 100%;
  max-height: 33rem;
  padding: 2.5rem 0 0 0;
  overflow-y: scroll;
`;

export const ExtraProduct = styled(ColAnt)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  width: 25%;
  height: 15.81rem;
`;

export const ExtraProductCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: solid 1px var(--black);
  border-radius: 0.625rem;
  height: 100%;
  width: 100%;
  cursor: pointer;

  .product-name {
    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;
  }

  .product-price {
    font-size: 1.25rem;
    font-weight: 600;
  }

  .product-img {
    width: 5rem;
    height: 5rem;
  }

  .product-img-add {
    position: absolute;
    top: -1.5rem;
    left: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translateX(-50%);
    background-color: var(--orange-250);
    border-radius: 50%;
    width: 3rem;
    height: 3rem;
    border: 2px solid white;
  }
`;

export const Input = styled(InputAnt)``;

export const ButtonRegister = styled(ButtonAnt)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 7.68rem;
  background: var(--orange-250);
  color: var(--black);
  border-radius: 0.625rem;
  font-weight: 600;
  font-size: 2.25rem;
  border: none;
  box-shadow: #00000040 1.95px 1.95px 2.6px;
  margin: 1.5rem 0;

  :active,
  :hover,
  :focus {
    background: var(--orange-250);
    color: var(--black);
    border: none;
  }
`;

const ButtonCSS = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 27.8rem;
  height: 7.68rem;
  border-radius: 0.625rem;
  font-weight: 600;
  font-size: 2.25rem;
  color: var(--black);
`;

export const Button = styled(ButtonAnt)`
  ${ButtonCSS}
  background: var(--white);
  border: 3px solid var(--black);

  :active,
  :hover,
  :focus {
    background: var(--white);
    color: var(--black);
    border: 3px solid var(--black);
  }
`;

export const ButtonFinalize = styled(ButtonAnt)`
  ${ButtonCSS}
  border: none;
  background: var(--orange-250);

  :active,
  :hover,
  :focus {
    background: var(--orange-250);
    color: var(--black);
    border: none;
  }
`;

const IconCSS = css`
  height: 3rem;
  width: 3rem;
  cursor: pointer;
`;

export const Icon = styled.img`
  ${IconCSS}
  background-size: cover;
  background-position: center;
`;
