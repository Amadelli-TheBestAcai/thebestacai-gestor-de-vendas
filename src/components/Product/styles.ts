import styled from "styled-components";

import { Row, Col } from "antd";

import { AddCircle } from "../../styles/Icons";

export const Container = styled(Row)`
  width: 100%;
  padding: 2% 0;
  justify-content: space-evenly;
  border-bottom: 1px solid black;
  background: white;
`;

export const Column = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const Description = styled.label`
  font-size: 14px;
  font-weight: bold;
`;

export const AddIcon = styled(AddCircle)`
  width: 24px;
  height: 24px;
  color: var(--button-add);
  cursor: pointer;

  :hover {
    color: #1ed760;
    transition: 0.5s;
  }
`;
