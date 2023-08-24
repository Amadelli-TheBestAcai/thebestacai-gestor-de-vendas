import styled from "styled-components";

import {
  Input as InputAnt,
  Button as ButtonAnt,
  Col as ColAnt,
  Row as RowAnt,
  Modal as ModalAnt,
} from "antd";

export const Container = styled(ModalAnt)`
  span {
    font-size: 0.8rem;
  }
  .buttonSpan {
    font-size: 1.4rem;
    font-weight: 500;
  }

  .ant-modal-body{
    padding: 1.5rem 2rem;
  }
`;

export const Input = styled(InputAnt)`
  width: 100%;
  height: 3rem;
  border-radius: 10px;
`;

export const Row = styled(RowAnt)`
  width: 100%;
  align-items: center;
  justify-content: space-between;
  grid-gap: 5px;
`;

export const Col = styled(ColAnt)`
  label {
    margin-top: 1rem;
  }
`;

export const Button = styled(ButtonAnt)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 3.7rem;
  width: 100%;
  border-radius: 0.7rem;
  background: var(--orange-250);
  border: none;
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  margin-top: 10px;
  :active,
  :focus {
    background: var(--orange-250);
  }
  :hover {
    background: var(--orange-150);
  }
  @media only screen and (max-width: 1366px) {
    height: 3rem;
  }
  @media only screen and (max-width: 1280px) {
    height: 2.7rem;
  }
  @media only screen and (max-width: 800px) {
    height: 2rem;
    font-size: 1rem;
  }
`;

export const InputCode = styled(InputAnt)`
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
`;