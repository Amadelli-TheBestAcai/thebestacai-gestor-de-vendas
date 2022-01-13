import styled from "styled-components";

import { Row, Col } from "antd";

import { TrashRestoreAlt } from "../../styles/Icons";

export const Container = styled(Row)`
  display: flex;
  width: 100%;
  height: 100%;
  background: var(--white-40);
  margin-bottom: 8px;
`;

export const Column = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Button = styled.button`
  padding: 5%;
`;

export const DeleteIcon = styled(TrashRestoreAlt)`
  width: 1.2rem;
  height: 1.2rem;
  color: var(--red-600);
`;
