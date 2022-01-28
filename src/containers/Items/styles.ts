import styled from "styled-components";

import { Row, Col } from "antd";

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: flex-start;
  flex-direction: column;
`;

export const Header = styled(Row)`
  display: flex;
  width: 100%;
  height: 3rem;
  background: var(--black-opaco);
  border-radius: 3px;
`;

export const Column = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Description = styled.label`
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  text-transform: uppercase;
`;

export const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  align-items: flex-start;
  overflow-y: scroll;
`;

export const ItemContent = styled.div`
  width: 100%;
  height: 2.8rem;
  margin-top: 8px;
`;

export const EmptyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
