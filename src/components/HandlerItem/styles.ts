import styled from "styled-components";

import { Trash, Printer } from "../../styles/Icons";

import { Row, Col } from "antd";

export const Container = styled(Row)`
  width: 100%;
  height: 46px;

  background: #f9f9f9;
  border-bottom: 1px solid #f9f9f9;
  margin-top: 8px;
  border-radius: 3px;
`;

export const Column = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RemoveIcon = styled(Trash)`
  width: 25px;
  height: 25px;
  color: red;
  padding: 1% 0;
  cursor: pointer;
`;

export const PrinterIcon = styled(Printer)`
  width: 25px;
  height: 25px;
  color: black;
  padding: 1% 0;
  cursor: pointer;
`;

export const Description = styled.label`
  font-size: 16px;
  font-weight: bold;
`;
