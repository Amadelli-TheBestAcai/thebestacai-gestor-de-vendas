import styled, { css } from "styled-components";
import {
  Button as ButtonAnt,
  Input as InputAnt,
  Row as RowAnt,
  Col as ColAnt,
} from "antd";

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 77%;
  position: relative;
  overflow-y: auto;
  /* background: green; */
`;

export const MenuCategory = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 27%;
  height: 100%;
  /* background: red; */
  padding: 0 0.65rem;

  img {
    width: 12rem;
    height: 15.6rem;
  }
`;

interface IMenu {
  active: boolean;
}

export const CardCategoryMenu = styled.div<IMenu>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 3.75rem;
  margin: 1rem 0;
  padding: 0.125rem;
  border-radius: 0.31rem;
  box-shadow: 0.2rem 0.2rem 0.2rem var(--black-opacity-20);
  border-right: 0.625rem solid var(--white);
  background: var(--white);

  span {
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  ${({ active }) => {
    if (active) {
      return css`
        border-right: 0.625rem solid var(--orange-250);
      `;
    }
  }}
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 73%;
  height: 100%;
  padding: 2.5rem;

  .title {
    font-size: 2.5rem;
    font-weight: 600;
    letter-spacing: 0;
  }

  .extra-products-content {
    width: 100%;
    max-height: fit-content;
  }

  .extra-products-title {
    display: flex;
    align-items: flex-start;
    text-transform: capitalize;
    font-size: 2.5rem;
    font-weight: 600;
    letter-spacing: 0;
  }

  .self-service-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 3rem 0;
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
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 23%;
  position: absolute;
  bottom: 0;
  background: yellow;
`;

export const OrderProductList = styled(RowAnt)`
  width: 100%;
  overflow-y: auto;
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

  .order-item-image {
    width: 7.5rem;
    height: 7.5rem;
    margin-right: 0.18rem;
    object-fit: contain;
    background-size: cover;
    background-position: center;
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

interface IExtra {
  size: number;
}

export const ExtraProductList = styled(RowAnt)<IExtra>`
  width: 100%;
  max-height: 55rem;
  padding: 2.5rem 0 0 0;
  overflow-y: auto;

  ${({ size }) => {
    if (size === 1) {
      return css`
        max-height: 55rem;
      `;
    }
    if (size === 2) {
      return css`
        max-height: 45rem;
      `;
    }
    if (size >= 3) {
      return css`
        max-height: 33rem;
      `;
    }
  }}
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
    object-fit: contain;
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
  height: 5rem;
  background: var(--orange-250);
  color: var(--black);
  border-radius: 0.625rem;
  font-weight: 600;
  font-size: 1.75rem;
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
  height: 5rem;
  border-radius: 0.625rem;
  font-weight: 600;
  font-size: 1.75rem;
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
  height: 2.5rem;
  width: 2.5rem;
  cursor: pointer;
`;

export const Icon = styled.img`
  ${IconCSS}
  background-size: cover;
  background-position: center;
`;
