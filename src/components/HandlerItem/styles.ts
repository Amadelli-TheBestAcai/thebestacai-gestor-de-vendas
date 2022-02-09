import styled, { css } from "styled-components";

import { Trash, Printer } from "../../styles/Icons";

import { Row, Col } from "antd";

export const Container = styled(Row)`
  width: 100%;
  height: 46px;
  background: var(--white-40);
  margin-top: 8px;
  border-radius: 3px;
  color: var(--grey-200);

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    font-size: 0.85rem;
  }

  /*Responsive 1440px*/
  @media (max-width: 1440px) {
    font-size: 0.8rem;
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 0.7rem;
  }
`;

export const Column = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconCSS = css`
  width: 1.3rem;
  height: 1.3rem;
  cursor: pointer;

  /*Responsive 1600px*/
  @media (max-width: 1600px) {
    width: 1.1rem;
    height: 1.1rem;
  }
`;

export const RemoveIcon = styled(Trash)`
  ${IconCSS}
`;

export const PrinterIcon = styled(Printer)`
  ${IconCSS}
`;
