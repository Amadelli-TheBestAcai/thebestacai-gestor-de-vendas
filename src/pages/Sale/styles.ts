import styled from "styled-components";

import { Row, Col } from "antd";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 98%;
  margin: 1%;
  width: 100%;
  background: #fff;
`;

export const SalesContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #dddddd;
`;

export const SalesHeader = styled(Row)`
  background: var(--primary-orange);
  padding: 0 16px;
  padding-left: 40px;
`;

export const Column = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.label`
  font-size: 16px;
  font-weight: bold;
`;

export const SalesList = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
`;
