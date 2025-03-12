import styled from "styled-components";

import { Row as RowAnt, Col as ColAnt } from "antd";

export const Container = styled(RowAnt)`
  width: 100%;
  overflow-y: auto;

  ::-webkit-scrollbar {
    width: 0.5rem;
  }

  ::-webkit-scrollbar-track {
    background: var(--gray-50);
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--red-500);
    border-radius: 5px;
  }
`;

export const OrderProduct = styled(ColAnt)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 5rem;
  margin: 0.5rem 0;
  padding: 0.625rem;
  background: var(--orange-190);
  border-radius: 0.625rem;

  .order-item-content {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .order-item-name {
    font-size: 1.5rem;
    font-weight: bold;
    text-transform: capitalize;
  }
  .order-item-price {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0 0.2rem;
  }

  .order-item-actions {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    align-items: center;
  }

  .order-item-image {
    width: 2.5rem;
    height: 2.5rem;
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
