import styled, { css } from "styled-components";

import { Trash, Printer } from "../../styles/Icons";

import { Row, Col } from "antd";

export const Container = styled(Row)`
  width: 100%;
  height: 46px;
  background: #f9f9f9;
  margin-top: 8px;
  border-radius: 3px;
  color: #4d4d4d;
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
`;

export const RemoveIcon = styled(Trash)`
  ${IconCSS}
`;

export const PrinterIcon = styled(Printer)`
  ${IconCSS}
`;
