import styled from "styled-components";

import { Row, Col } from "antd";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  width: 100%;
  height: 30%;
  font-weight: 600;
  color: var(--black-opaco);
  text-transform: uppercase;
  font-size: 0.9rem;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 70%;
  overflow-y: scroll;
`;

export const InfoPayment = styled(Row)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40%;
  margin-top: 3px;
  background: var(--white-70);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--black-opaco);
`;

export const Column = styled(Col)`
  text-align: center;
`;
