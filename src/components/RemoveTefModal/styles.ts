import styled, { css } from "styled-components";

import {
  Modal as ModalAnt,
  Row as RowAnt,
  Col as ColAnt,
  Button as ButtonAnt,
  Input as InputAnt
} from "antd";

const { TextArea } = InputAnt;

export const Container = styled(ModalAnt)`
  h2 {
    margin: 0;
  }

  b {
    font-size: 1rem;
    color: var(--red-600);
    margin-top: 1rem;
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

export const HeaderRow = styled(RowAnt)`
  display: flex;
  width: 100%;
  height: 1.5rem;
  background: var(--grey-200);

  .ant-col {
    color: white !important;
  }
`;
export const HeaderCol = styled(ColAnt)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Row = styled(RowAnt)``;

export const Col = styled(ColAnt)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1.3rem;
  background: var(--white-30);
  border: 1px 0;
`;

export const ButtonRemove = styled(ButtonAnt)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  border-radius: 1rem;
  background: var(--red-600);
  color: var(--white);
  border: none;
  box-shadow: none;

  &&&:hover,
  &&&:focus,
  &&&:active {
    opacity: 80%;
    background: var(--red-600);
    color: var(--white);
    border: none;
    box-shadow: none;
  }
`;

export const Textarea = styled(TextArea)`
  height: 3.7rem;
  width: 20%;

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    @media (max-height: 900px) {
      height: 3.4rem;
      font-size: 0.8rem;
    }
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    height: 3rem;
    font-size: 0.7rem;
  }
`;