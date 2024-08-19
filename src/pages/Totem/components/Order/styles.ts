import styled, { css } from "styled-components";
import { Button as ButtonAnt, Input as InputAnt } from "antd";
import { Trash } from "../../../../styles/Icons";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;

  .order-resume .self-service-content,
  .order-list-content,
  .self-service-content,
  .extra-products-content,
  .footer {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
  }

  .order-resume {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 50%;
    height: 5%;
  }

  .order-list-content {
    width: 50%;
    max-height: 35%;
    overflow: auto;
  }

  .self-service-content {
    height: 15%;
  }

  .extra-products-content {
    height: 30%;
    .extra-products-list {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 50%;
      flex-wrap: wrap;
    }
  }

  .footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: 15%;
  }
`;

export const Input = styled(InputAnt)``;

export const Button = styled(ButtonAnt)`
  width: fit-content;
  height: 50px;
  background: var(--orange-250);
  color: var(--brown-500);
  border-radius: 5px;
  font-weight: 500;
  border: none;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;

  :active,
  :hover,
  :focus {
    background: var(--orange-250);
    color: var(--brown-500);
    border: none;
  }

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      width: 105px;
      height: 40px;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    width: 100px;
    height: 35px;
    font-size: 0.8rem;
  }
`;

export const OrderProduct = styled.div`
  display: flex;
  width: 100%;
  height: 3rem;
  justify-content: space-between;
  align-items: center;

  margin: 5px 0;

  .order-item-info {
    display: flex;
    flex-direction: column;
  }

  .order-item-actions {
    display: flex;
    justify-content: center;
    align-items: center;

    .order-item-quantity {
      display: flex;
      justify-content: center;
      align-items: center;
      border: solid 1px;
      border-radius: 5px;
      height: 3rem;
      width: 3rem;
    }
  }
`;

export const ExtraProduct = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: solid 1px;
  border-radius: 5px;
  height: 5rem;
  width: 5rem;
  margin: 0.25rem;
  cursor: pointer;

  span {
    font-size: 0.7rem;
    text-align: center;
  }

  .product_price {
    color: #008000a6;
    font-weight: bold;
    font-size: 0.8rem;
  }
`;

const IconCSS = css`
  height: 1.8rem;
  width: 1.8rem;
  cursor: pointer;

  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      height: 1.5rem;
      width: 1.5rem;
    }
  }

  @media (max-width: 1366px) {
    height: 1.2rem;
    width: 1.2rem;
  }
`;
export const TrashIcon = styled(Trash)`
  ${IconCSS}
  color: #ff00009c;
`;
