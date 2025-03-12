import styled, { css } from "styled-components";

import {
  Button as ButtonAnt,
  Modal as ModalAnt,
  Row as RowAnt,
  Col as ColAnt,
} from "antd";

export const Container = styled(ModalAnt)`
  .ant-modal-content {
    height: 100%;
    width: 100%;
    border-radius: 6.25rem;
    padding: 5rem;
    .ant-modal-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      width: 100%;
      padding: 0;
      font-size: 2rem;
    }
  }
  .modal-title {
    font-family: "VisbyCF";
    font-size: 3.75rem;
    font-weight: 600;
  }
  .modal-footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
`;

export const ProductList = styled(RowAnt)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 2.5rem 0 0 0;
  overflow-x: auto;
`;

export const Product = styled(ColAnt)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  width: 25%;
  height: 15.81rem;
  margin: 0 0.5rem;
`;

const ButtonCSS = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 23.8rem;
  height: 7.68rem;
  margin: 0 1rem;
  span {
    font-family: "VisbyCF";
    font-weight: 600;
    font-size: 2.25rem;
    color: var(--black);
  }
`;

export const ButtonContinue = styled(ButtonAnt)`
  ${ButtonCSS}
  background: var(--white);
  border: none;
  border-bottom: 3px solid var(--black);

  :active,
  :hover,
  :focus {
    background: var(--white);
    color: var(--black);
    border: none;
    border-bottom: 3px solid var(--black);
  }
`;
