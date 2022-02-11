import styled from "styled-components";

import { Row, Col } from "antd";

import { AddCircle } from "../../styles/Icons";

export const Container = styled(Row)`
  width: 100%;
  padding: 3%;
  background: var(--white-40);
  margin-top: 9px;
`;

export const Column = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;

  /* Responsive 1600 */
  @media (max-width: 1600px) {
    font-size: 0.8rem;
  }

  /*Responsive 1366px*/
  @media (max-width: 1366px) {
    font-size: 0.7rem;
  }
`;

export const AddIcon = styled(AddCircle)`
  cursor: pointer;
  height: 1.5rem;
  width: 1.5rem;
  fill: var(--green-600);

  /* Responsive 1600 */
  @media (max-width: 1600px) {
    height: 1.2rem;
    width: 1.2rem;
  }
`;
